const selectors = require("../fixtures/selectors.json");

Cypress.Commands.add("pickFirstAvailableSeanceForHall", (hallNames) => {
  const list = (Array.isArray(hallNames) ? hallNames : [hallNames]).filter(
    Boolean
  );
  const { seances, main } = selectors.client;
  const availSel = "a.movie-seances__time:not(.acceptin-button-disabled)";

  const selectDay = (hallIndex, dayIdx) => {
    if (hallIndex === 0 && dayIdx === 0) {
      return;
    }
    cy.get(main.pageNavDay).should("have.length", 7);
    cy.get(main.pageNavDay).eq(dayIdx).click({ force: true });
    cy.wait(200);
  };

  const tryAt = (hallIndex, dayIdx) => {
    const name = list[hallIndex];
    if (name === undefined) {
      throw new Error(
        "Не найден доступный сеанс ни в одном зале из админки за 7 дней."
      );
    }

    selectDay(hallIndex, dayIdx);

    cy.get("body").then(($body) => {
      const $title = $body
        .find(seances.hallTitle)
        .filter((_, el) => el.textContent.trim() === name);

      if ($title.length === 0) {
        if (hallIndex < list.length - 1) {
          tryAt(hallIndex + 1, 0);
        } else {
          throw new Error(`В расписании нет зала «${name}».`);
        }
        return;
      }

      const $link = $title
        .first()
        .closest(seances.hallBlock)
        .find(availSel)
        .first();

      if ($link.length) {
        cy.wrap(name).as("bookingHallName");
        cy.wrap($link).click({ force: true });
      } else if (dayIdx < 6) {
        tryAt(hallIndex, dayIdx + 1);
      } else if (hallIndex < list.length - 1) {
        tryAt(hallIndex + 1, 0);
      } else {
        throw new Error(
          `Нет свободных сеансов (не в прошлом) для залов: ${list.join(", ")}`
        );
      }
    });
  };

  tryAt(0, 0);
});

/** Отправка формы логина в браузере (нужна для sad path — виден текст ошибки на странице). */
Cypress.Commands.add("submitAdminLoginForm", (email, password) => {
  const { login } = selectors.admin;
  cy.get(login.emailInput).clear().type(email);
  cy.get(login.passwordInput).clear().type(password);
  cy.get(login.submitButton).click();
});

/**
 * Вход в админку: POST через cy.request (сессионные cookie), затем открытие панели.
 * Так обходим ситуацию, когда после submit формы URL «застывает» на authorization.php без перехода в Cypress.
 */
Cypress.Commands.add("loginAdmin", (email, password) => {
  cy.request({
    method: "POST",
    url: "/admin/scripts/authorization.php",
    form: true,
    body: { email, password },
    failOnStatusCode: false,
  }).then((res) => {
    const text = String(res.body || "").trim();
    const looksLikeLoginRejected =
      text === "Ошибка авторизации!" ||
      (text.length < 120 && text.includes("Ошибка авторизации"));
    if (looksLikeLoginRejected) {
      throw new Error(
        "Авторизация не удалась (логин/пароль в cypress/fixtures/admin-login.json; на qamid пароль обычно qamid без «;» из README)."
      );
    }
  });
  cy.visit("/admin/index.php");
});
