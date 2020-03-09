package com.yutoo.admin.product.base.entity;

import java.io.Serializable;
import java.util.Date;



/**
 * 产品变体属性表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月14日 上午9:12:03
 */
public class ProductPropertyEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer productPropertyId;
	
	/**
	 * 产品的属性id   和类目模板表对应
	 */
	private Integer categoryPropertyId;
	
	/**
	 * 母体id或变体id
	 */
	private Integer productId;
	
	/**
	 * 
	 */
	private String propertyName;
	
	/**
	 * 
	 */
	private String propertyValue;
	
	/**
	 * 产品来源 1.系统设置   0.非系统设置
	 */
	private Integer propertyOriginal;
	
	/**
	 * 是否变体属性  1. true  0. false
	 */
	private Integer variantPropFlag;
	
	/**
	 * 
	 */
	private Date createTime;
	
	/**
	 * 
	 */
	private Date modifyTime;
	
	/**
	 * 
	 */
	private String version;
	

	public ProductPropertyEntity() {
		super();
	}

	public void setProductPropertyId(Integer productPropertyId) {
		this.productPropertyId = productPropertyId;
	}
	
	public Integer getProductPropertyId() {
		return productPropertyId;
	}
	
	public void setCategoryPropertyId(Integer categoryPropertyId) {
		this.categoryPropertyId = categoryPropertyId;
	}
	
	public Integer getCategoryPropertyId() {
		return categoryPropertyId;
	}
	
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	
	public Integer getProductId() {
		return productId;
	}
	
	public void setPropertyName(String propertyName) {
		this.propertyName = propertyName;
	}
	
	public String getPropertyName() {
		return propertyName;
	}
	
	public void setPropertyValue(String propertyValue) {
		this.propertyValue = propertyValue;
	}
	
	public String getPropertyValue() {
		return propertyValue;
	}
	
	public void setPropertyOriginal(Integer propertyOriginal) {
		this.propertyOriginal = propertyOriginal;
	}
	
	public Integer getPropertyOriginal() {
		return propertyOriginal;
	}
	
	public void setVariantPropFlag(Integer variantPropFlag) {
		this.variantPropFlag = variantPropFlag;
	}
	
	public Integer getVariantPropFlag() {
		return variantPropFlag;
	}
	
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
	public Date getCreateTime() {
		return createTime;
	}
	
	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}
	
	public Date getModifyTime() {
		return modifyTime;
	}
	
	public void setVersion(String version) {
		this.version = version;
	}
	
	public String getVersion() {
		return version;
	}
	
}
