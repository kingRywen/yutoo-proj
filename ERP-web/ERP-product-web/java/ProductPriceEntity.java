package com.yutoo.admin.product.purchase.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;



/**
 * 产品价格表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月15日 下午2:22:45
 */
public class ProductPriceEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer productPriceId;
	
	/**
	 * 创建时间
	 */
	private Date createTime;
	
	/**
	 * 修改时间
	 */
	private Date modifyTime;
	
	/**
	 * 更新记录（乐观锁）
	 */
	private Integer version;
	
	/**
	 * 产品id或变体id
	 */
	private Integer productId;
	
	/**
	 * 产品状态
枚举：
1，正常
2，仅批量
3，暂时缺货
4，停产
5，锁定
6，清库
	 */
	private Integer productStatus;
	
	/**
	 * 产品状态备注
	 */
	private String statusRemark;
	
	/**
	 * 供应商报价
	 */
	private BigDecimal supplierPrice;
	
	/**
	 * 采购运费
	 */
	private BigDecimal freightCost;
	
	/**
	 * 开票税点
	 */
	private BigDecimal taxInvoice;
	
	/**
	 * 含税价
	 */
	private BigDecimal taxPrice;
	
	/**
	 * 原销售价
	 */
	private BigDecimal salePriceOriginal;
	
	/**
	 * 现销售价
	 */
	private BigDecimal salePriceNow;
	
	/**
	 * 是否包邮  枚举
	 */
	private Integer pinkageFlag;
	
	/**
	 * 运费
	 */
	private BigDecimal freightPrice;
	

	public ProductPriceEntity() {
		super();
	}

	public void setProductPriceId(Integer productPriceId) {
		this.productPriceId = productPriceId;
	}
	
	public Integer getProductPriceId() {
		return productPriceId;
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
	
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	
	public Integer getProductId() {
		return productId;
	}
	
	public void setProductStatus(Integer productStatus) {
		this.productStatus = productStatus;
	}
	
	public Integer getProductStatus() {
		return productStatus;
	}
	
	public void setStatusRemark(String statusRemark) {
		this.statusRemark = statusRemark;
	}
	
	public String getStatusRemark() {
		return statusRemark;
	}
	
	public void setSupplierPrice(BigDecimal supplierPrice) {
		this.supplierPrice = supplierPrice;
	}
	
	public BigDecimal getSupplierPrice() {
		return supplierPrice;
	}
	
	public void setFreightCost(BigDecimal freightCost) {
		this.freightCost = freightCost;
	}
	
	public BigDecimal getFreightCost() {
		return freightCost;
	}
	
	public void setTaxInvoice(BigDecimal taxInvoice) {
		this.taxInvoice = taxInvoice;
	}
	
	public BigDecimal getTaxInvoice() {
		return taxInvoice;
	}
	
	public void setTaxPrice(BigDecimal taxPrice) {
		this.taxPrice = taxPrice;
	}
	
	public BigDecimal getTaxPrice() {
		return taxPrice;
	}
	
	public void setSalePriceOriginal(BigDecimal salePriceOriginal) {
		this.salePriceOriginal = salePriceOriginal;
	}
	
	public BigDecimal getSalePriceOriginal() {
		return salePriceOriginal;
	}
	
	public void setSalePriceNow(BigDecimal salePriceNow) {
		this.salePriceNow = salePriceNow;
	}
	
	public BigDecimal getSalePriceNow() {
		return salePriceNow;
	}
	
	public void setPinkageFlag(Integer pinkageFlag) {
		this.pinkageFlag = pinkageFlag;
	}
	
	public Integer getPinkageFlag() {
		return pinkageFlag;
	}
	
	public void setFreightPrice(BigDecimal freightPrice) {
		this.freightPrice = freightPrice;
	}
	
	public BigDecimal getFreightPrice() {
		return freightPrice;
	}
	
}
