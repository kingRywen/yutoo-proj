//加入精确否定词
Blockly.Blocks['index_joinPreciseNegative'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("加入精确否定词"), "joinPreciseNegative");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setColour(135);
 this.setTooltip("加入精确否定词");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};

//加入词组否定词
Blockly.Blocks['index_joinNegativePhrase'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("加入词组否定词"), "joinNegativePhrase");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setColour(135);
 this.setTooltip("加入词组否定词");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};


//暂停广告
Blockly.Blocks['index_stopAdvertising'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("暂停广告"), "stopAdvertising");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setColour(135);
 this.setTooltip("暂停广告");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};

//人工筛选
Blockly.Blocks['index_artificialSelection'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("人工筛选"), "artificialSelection");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setColour(135);
 this.setTooltip("人工筛选");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};

//加入排除
Blockly.Blocks['index_joinRuleout'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("加入排除"), "joinRuleout");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setColour(135);
 this.setTooltip("加入排除");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};