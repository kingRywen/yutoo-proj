package com.yutoo.admin.product.purchase.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;



/**
 * 产品头程表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月16日 下午4:14:16
 */
public class ProductTransportRelEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer transportRelId;
	
	/**
	 * 
	 */
	private Integer productId;
	
	/**
	 * 头程id
	 */
	private Integer transportId;
	
	/**
	 * 单个产品运费
	 */
	private BigDecimal freightPriceSingle;
	
	/**
	 * 单个产品税费
	 */
	private BigDecimal taxesSingle;
	
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
	

	public ProductTransportRelEntity() {
		super();
	}

	public void setTransportRelId(Integer transportRelId) {
		this.transportRelId = transportRelId;
	}
	
	public Integer getTransportRelId() {
		return transportRelId;
	}
	
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	
	public Integer getProductId() {
		return productId;
	}
	
	public void setTransportId(Integer transportId) {
		this.transportId = transportId;
	}
	
	public Integer getTransportId() {
		return transportId;
	}
	
	public void setFreightPriceSingle(BigDecimal freightPriceSingle) {
		this.freightPriceSingle = freightPriceSingle;
	}
	
	public BigDecimal getFreightPriceSingle() {
		return freightPriceSingle;
	}
	
	public void setTaxesSingle(BigDecimal taxesSingle) {
		this.taxesSingle = taxesSingle;
	}
	
	public BigDecimal getTaxesSingle() {
		return taxesSingle;
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
