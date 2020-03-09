//花费
Blockly.Blocks['index_cost'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("花费"), "cost")
        .appendField(new Blockly.FieldDropdown([[">",">"], ["<","<"], ["=","="], [">=",">="], ["<=","<="]]), "operator")
        .appendField(new Blockly.FieldTextInput(""), "value");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(270);
 this.setTooltip("123");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};

//无效点击数
Blockly.Blocks['index_invalidClicks'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("无效点击数"), "invalidClicks")
        .appendField(new Blockly.FieldDropdown([[">",">"], ["<","<"], ["=","="], [">=",">="], ["<=","<="]]), "operator")
        .appendField(new Blockly.FieldTextInput(""), "value");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(270);
 this.setTooltip("123");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};

//转化率
Blockly.Blocks['index_conversion'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("转化率"), "conversion")
        .appendField(new Blockly.FieldDropdown([[">",">"], ["<","<"], ["=","="], [">=",">="], ["<=","<="]]), "operator")
        .appendField(new Blockly.FieldTextInput(""), "value");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(270);
 this.setTooltip("123");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};

//ACOS
Blockly.Blocks['index_acos'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("ACOS"), "acos")
        .appendField(new Blockly.FieldDropdown([[">",">"], ["<","<"], ["=","="], [">=",">="], ["<=","<="]]), "operator")
        .appendField(new Blockly.FieldTextInput(""), "value");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(270);
 this.setTooltip("123");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};

//订单量
Blockly.Blocks['index_orderQuantity'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("订单量"), "orderQuantity")
        .appendField(new Blockly.FieldDropdown([[">",">"], ["<","<"], ["=","="], [">=",">="], ["<=","<="]]), "operator")
        .appendField(new Blockly.FieldTextInput(""), "value");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(270);
 this.setTooltip("123");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};

//ctr
Blockly.Blocks['index_ctr'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabelSerializable("CTR"), "ctr")
        .appendField(new Blockly.FieldDropdown([[">",">"], ["<","<"], ["=","="], [">=",">="], ["<=","<="]]), "operator")
        .appendField(new Blockly.FieldTextInput(""), "value");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(270);
 this.setTooltip("123");
 this.setHelpUrl("https://developers.google.cn/blockly/");
  }
};