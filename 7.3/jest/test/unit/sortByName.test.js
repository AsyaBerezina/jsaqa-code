const sorting = require("../../app");

describe("Books names test suit", () => {
  it("Books names should be sorted in ascending order", () => {
    expect(
      sorting.sortByName([
        "Гарри Поттер",
        "Властелин Колец",
        "Волшебник изумрудного города",
      ])
    ).toEqual([
      "Властелин Колец",
      "Волшебник изумрудного города",
      "Гарри Поттер",
    ]);
  });

  it("Names equal ignoring case use comparator return 0 (stable relative order)", () => {
    expect(sorting.sortByName(["cc", "Bb", "aa", "AA"])).toEqual([
      "aa",
      "AA",
      "Bb",
      "cc",
    ]);
  });
});
