Blockly.Blocks['operator_with'] = {
  init: function() {
    this.appendValueInput("&&")
        .setCheck(null)
        .appendField("与");
    this.setOutput(true, null);
    this.setColour(45);
 this.setTooltip("与");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};