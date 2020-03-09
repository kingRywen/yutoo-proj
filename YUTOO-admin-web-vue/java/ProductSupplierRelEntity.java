package com.yutoo.admin.product.purchase.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;



/**
 * 产品供应商关联表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月16日 下午7:18:28
 */
public class ProductSupplierRelEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer productSupplierRelId;
	
	/**
	 * 
	 */
	private Integer productId;
	
	/**
	 * 
	 */
	private Integer supplierId;
	
	/**
	 * 
	 */
	private String supplierName;
	
	/**
	 * 
	 */
	private String supplierSku;
	
	/**
	 * 网络采集地址
	 */
	private String purchaseLink;
	
	/**
	 * 供应商地址省市id
	 */
	private Integer supplierAddressId;
	
	/**
	 * 是否提供供备品
	 */
	private Integer sampleFlag;
	
	/**
	 * 供应商报价
	 */
	private BigDecimal supplierPrice;
	
	/**
	 * 加工费用
	 */
	private BigDecimal processingPrice;
	
	/**
	 * 其他费用
	 */
	private BigDecimal otherPrice;
	
	/**
	 * 采购费用
	 */
	private BigDecimal purchasePrice;
	
	/**
	 * 批发数量
	 */
	private Integer wholesaleAmount;
	
	/**
	 * 批发价
	 */
	private BigDecimal wholesalePrice;
	
	/**
	 * 备注
	 */
	private String remark;
	
	/**
	 * 采购天数
	 */
	private Integer purchaseTime;
	
	/**
	 * 生产天数
	 */
	private Integer produceTime;
	
	/**
	 * 运输天数
	 */
	private Integer freightTime;
	
	/**
	 * 供应商报价时间
	 */
	private Date supplierPriceTime;
	
	/**
	 * 是否为默认供应商   1,默认  0.no
	 */
	private Integer defaultFlag;
	
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
	

	public ProductSupplierRelEntity() {
		super();
	}

	public void setProductSupplierRelId(Integer productSupplierRelId) {
		this.productSupplierRelId = productSupplierRelId;
	}
	
	public Integer getProductSupplierRelId() {
		return productSupplierRelId;
	}
	
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	
	public Integer getProductId() {
		return productId;
	}
	
	public void setSupplierId(Integer supplierId) {
		this.supplierId = supplierId;
	}
	
	public Integer getSupplierId() {
		return supplierId;
	}
	
	public void setSupplierName(String supplierName) {
		this.supplierName = supplierName;
	}
	
	public String getSupplierName() {
		return supplierName;
	}
	
	public void setSupplierSku(String supplierSku) {
		this.supplierSku = supplierSku;
	}
	
	public String getSupplierSku() {
		return supplierSku;
	}
	
	public void setPurchaseLink(String purchaseLink) {
		this.purchaseLink = purchaseLink;
	}
	
	public String getPurchaseLink() {
		return purchaseLink;
	}
	
	public void setSupplierAddressId(Integer supplierAddressId) {
		this.supplierAddressId = supplierAddressId;
	}
	
	public Integer getSupplierAddressId() {
		return supplierAddressId;
	}
	
	public void setSampleFlag(Integer sampleFlag) {
		this.sampleFlag = sampleFlag;
	}
	
	public Integer getSampleFlag() {
		return sampleFlag;
	}
	
	public void setSupplierPrice(BigDecimal supplierPrice) {
		this.supplierPrice = supplierPrice;
	}
	
	public BigDecimal getSupplierPrice() {
		return supplierPrice;
	}
	
	public void setProcessingPrice(BigDecimal processingPrice) {
		this.processingPrice = processingPrice;
	}
	
	public BigDecimal getProcessingPrice() {
		return processingPrice;
	}
	
	public void setOtherPrice(BigDecimal otherPrice) {
		this.otherPrice = otherPrice;
	}
	
	public BigDecimal getOtherPrice() {
		return otherPrice;
	}
	
	public void setPurchasePrice(BigDecimal purchasePrice) {
		this.purchasePrice = purchasePrice;
	}
	
	public BigDecimal getPurchasePrice() {
		return purchasePrice;
	}
	
	public void setWholesaleAmount(Integer wholesaleAmount) {
		this.wholesaleAmount = wholesaleAmount;
	}
	
	public Integer getWholesaleAmount() {
		return wholesaleAmount;
	}
	
	public void setWholesalePrice(BigDecimal wholesalePrice) {
		this.wholesalePrice = wholesalePrice;
	}
	
	public BigDecimal getWholesalePrice() {
		return wholesalePrice;
	}
	
	public void setRemark(String remark) {
		this.remark = remark;
	}
	
	public String getRemark() {
		return remark;
	}
	
	public void setPurchaseTime(Integer purchaseTime) {
		this.purchaseTime = purchaseTime;
	}
	
	public Integer getPurchaseTime() {
		return purchaseTime;
	}
	
	public void setProduceTime(Integer produceTime) {
		this.produceTime = produceTime;
	}
	
	public Integer getProduceTime() {
		return produceTime;
	}
	
	public void setFreightTime(Integer freightTime) {
		this.freightTime = freightTime;
	}
	
	public Integer getFreightTime() {
		return freightTime;
	}
	
	public void setSupplierPriceTime(Date supplierPriceTime) {
		this.supplierPriceTime = supplierPriceTime;
	}
	
	public Date getSupplierPriceTime() {
		return supplierPriceTime;
	}
	
	public void setDefaultFlag(Integer defaultFlag) {
		this.defaultFlag = defaultFlag;
	}
	
	public Integer getDefaultFlag() {
		return defaultFlag;
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
