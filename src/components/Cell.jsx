export default function Cell (props) {
    const value = props.value;

    const className =
      "cell" +
      (value.isRevealed ? "" : " hidden") +
      (value.isMine ? " is-mine" : "") +
      (value.isClicked ? " is-clicked" : "") +
      (value.isEmpty ? " is-empty" : "") +
      (value.isUnknown ? " is-unknown" : "") +
      (value.isFlagged ? " is-flag" : "") +
      (value.isUnknown ? " is-questioned" : "");

    return (
        <div className={className}
            onClick={props.onClick}
            onContextMenu={props.cMenu}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
        >
            {
                !value.isRevealed ? value.isFlagged ? "🚩" : value.isUnknown ? "❓" : null
                : value.isMine ? "💣"
                : value.isEmpty ? ""
                : value.n
            }
        </div>
    );
}
