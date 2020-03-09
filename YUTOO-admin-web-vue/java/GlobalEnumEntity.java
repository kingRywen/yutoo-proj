package com.yutoo.admin.product.constant.entity;

import java.io.Serializable;
import java.util.Date;



/**
 * 
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月15日 上午9:36:57
 */
public class GlobalEnumEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer globalEnumId;
	
	/**
	 * 数据类型
	 */
	private String type;
	
	/**
	 * 字典key
	 */
	private Integer key;
	
	/**
	 * 字典value
	 */
	private String value;
	

	public GlobalEnumEntity() {
		super();
	}

	public void setGlobalEnumId(Integer globalEnumId) {
		this.globalEnumId = globalEnumId;
	}
	
	public Integer getGlobalEnumId() {
		return globalEnumId;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	public String getType() {
		return type;
	}
	
	public void setKey(Integer key) {
		this.key = key;
	}
	
	public Integer getKey() {
		return key;
	}
	
	public void setValue(String value) {
		this.value = value;
	}
	
	public String getValue() {
		return value;
	}
	
}
