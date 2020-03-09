//统计方式
Blockly.Blocks['fixed_statisticalPattern'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("统计方式"), "statisticalPattern")
        .appendField(new Blockly.FieldDropdown([["所有","all"], ["产品","product"], ["广告系列","adSeries"], ["广告组","adGroup"], ["广告词","adWord"], ["客户搜索词","searchWord"]]), "statisticalPatternOption");
    this.setOutput(true, null);
    this.setColour(45);
 this.setTooltip("统计方式");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};

//广告时长
Blockly.Blocks['fixed_adtime'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("广告时长"), "adTime")
        .appendField(new Blockly.FieldTextInput(""), "adTimeMin")
        .appendField("天~")
        .appendField(new Blockly.FieldTextInput(""), "adTimeMax")
        .appendField("天");
    this.setOutput(true, null);
    this.setColour(45);
 this.setTooltip("广告时长");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};

//关键词类型
Blockly.Blocks['fixed_keywordType'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("类型"), "keywordType")
        .appendField(new Blockly.FieldDropdown([["广告词","adWord"], ["客户搜索词","searchWord"], ["ASIN","asin"]]), "keywordTypeOption");
    this.setOutput(true, null);
    this.setColour(45);
 this.setTooltip("关键词类型");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};