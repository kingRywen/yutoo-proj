Blockly.Blocks['block_common'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("统计方式"), "statisticalPattern")
        .appendField(new Blockly.FieldDropdown([["所有","all"], ["产品","product"], ["广告系列","adSeries"], ["广告组","adGroup"], ["广告词","adWord"], ["客户搜索词","searchWord"]]), "statisticalPatternOption");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("类型"), "type")
        .appendField(new Blockly.FieldDropdown([["广告词","adWord"], ["客户搜索词","searchWord"], ["ASIN","asin"]]), "typeOption");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("广告时长"), "adTime")
        .appendField(new Blockly.FieldTextInput(""), "adTimeMin")
        .appendField("天~")
        .appendField(new Blockly.FieldTextInput(""), "adTimeMax")
        .appendField("天");
    this.setOutput(true, null);
    this.setColour(315);
 this.setTooltip("常用");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};