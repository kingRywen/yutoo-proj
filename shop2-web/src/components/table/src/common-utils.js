export function showRow(row) {
  let style = "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;",
    color = "";
  if (this.treeColor) {
    color =
      "background-color: " +
      (typeof this.treeColor === "string" ? this.treeColor : "#f2f6fc");
  }
  const show = row.row.parent
    ? row.row.parent._expanded && row.row.parent.__show
    : true;
  row.row.__show = show;
  return show
    ? row.row._level !== 1
      ? style + color
      : style
    : { display: "none" };
}
