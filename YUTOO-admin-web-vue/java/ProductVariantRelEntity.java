package com.yutoo.admin.product.base.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;



/**
 * 产品变体关联表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月15日 上午9:24:38
 */
public class ProductVariantRelEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer variantRelId;
	
	/**
	 * 变体id
	 */
	private Integer productId;
	
	/**
	 * 被关联的变体id
	 */
	private Integer relVariantId;
	
	/**
	 * 关联种类   1，产品配件2.成品原料 3.运输包材，4采购包材 5.组合产品
	 */
	private Integer relType;
	
	/**
	 * 数量
	 */
	private Integer relNum;
	
	/**
	 * 单价
	 */
	private BigDecimal relVariantPrice;
	
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
	private Integer version;
	

	public ProductVariantRelEntity() {
		super();
	}

	public void setVariantRelId(Integer variantRelId) {
		this.variantRelId = variantRelId;
	}
	
	public Integer getVariantRelId() {
		return variantRelId;
	}
	
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	
	public Integer getProductId() {
		return productId;
	}
	
	public void setRelVariantId(Integer relVariantId) {
		this.relVariantId = relVariantId;
	}
	
	public Integer getRelVariantId() {
		return relVariantId;
	}
	
	public void setRelType(Integer relType) {
		this.relType = relType;
	}
	
	public Integer getRelType() {
		return relType;
	}
	
	public void setRelNum(Integer relNum) {
		this.relNum = relNum;
	}
	
	public Integer getRelNum() {
		return relNum;
	}
	
	public void setRelVariantPrice(BigDecimal relVariantPrice) {
		this.relVariantPrice = relVariantPrice;
	}
	
	public BigDecimal getRelVariantPrice() {
		return relVariantPrice;
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
	
	public void setVersion(Integer version) {
		this.version = version;
	}
	
	public Integer getVersion() {
		return version;
	}
	
}
