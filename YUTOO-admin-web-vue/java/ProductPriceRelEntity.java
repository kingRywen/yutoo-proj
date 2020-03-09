package com.yutoo.admin.product.purchase.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;



/**
 * 产品供货价参考表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月16日 下午5:29:07
 */
public class ProductPriceRelEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer productPriceRefId;
	
	/**
	 * 产品价格表的id
	 */
	private Integer productPriceId;
	
	/**
	 * 数量区间起始数
	 */
	private Integer purchaseNumStart;
	
	/**
	 * 数量区间终止数
	 */
	private Integer purchaseNumEnd;
	
	/**
	 * 购买价格
	 */
	private BigDecimal budgetPrice;
	
	/**
	 * 建议售价
	 */
	private BigDecimal suggestPrice;
	
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
	

	public ProductPriceRelEntity() {
		super();
	}

	public void setProductPriceRefId(Integer productPriceRefId) {
		this.productPriceRefId = productPriceRefId;
	}
	
	public Integer getProductPriceRefId() {
		return productPriceRefId;
	}
	
	public void setProductPriceId(Integer productPriceId) {
		this.productPriceId = productPriceId;
	}
	
	public Integer getProductPriceId() {
		return productPriceId;
	}
	
	public void setPurchaseNumStart(Integer purchaseNumStart) {
		this.purchaseNumStart = purchaseNumStart;
	}
	
	public Integer getPurchaseNumStart() {
		return purchaseNumStart;
	}
	
	public void setPurchaseNumEnd(Integer purchaseNumEnd) {
		this.purchaseNumEnd = purchaseNumEnd;
	}
	
	public Integer getPurchaseNumEnd() {
		return purchaseNumEnd;
	}
	
	public void setBudgetPrice(BigDecimal budgetPrice) {
		this.budgetPrice = budgetPrice;
	}
	
	public BigDecimal getBudgetPrice() {
		return budgetPrice;
	}
	
	public void setSuggestPrice(BigDecimal suggestPrice) {
		this.suggestPrice = suggestPrice;
	}
	
	public BigDecimal getSuggestPrice() {
		return suggestPrice;
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
