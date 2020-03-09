package com.yutoo.admin.product.constant.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;



/**
 * 
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月16日 下午4:39:29
 */
public class TransportFirstEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer transportFirstId;
	
	/**
	 * 商户id
	 */
	private Integer merchantId;
	
	/**
	 * 国家
	 */
	private Integer nationId;
	
	/**
	 * 运输方式  空运/.海运
	 */
	private String freightType;
	
	/**
	 * 运输价格
	 */
	private BigDecimal freightPrice;
	
	/**
	 * 参考税率
	 */
	private BigDecimal tariff;
	
	/**
	 * 运输天数
	 */
	private Integer freightTime;
	
	/**
	 * 
	 */
	private Date createTime;
	
	/**
	 * 
	 */
	private Date modifyTime;
	

	public TransportFirstEntity() {
		super();
	}

	public void setTransportFirstId(Integer transportFirstId) {
		this.transportFirstId = transportFirstId;
	}
	
	public Integer getTransportFirstId() {
		return transportFirstId;
	}
	
	public void setMerchantId(Integer merchantId) {
		this.merchantId = merchantId;
	}
	
	public Integer getMerchantId() {
		return merchantId;
	}
	
	public void setNationId(Integer nationId) {
		this.nationId = nationId;
	}
	
	public Integer getNationId() {
		return nationId;
	}
	
	public void setFreightType(String freightType) {
		this.freightType = freightType;
	}
	
	public String getFreightType() {
		return freightType;
	}
	
	public void setFreightPrice(BigDecimal freightPrice) {
		this.freightPrice = freightPrice;
	}
	
	public BigDecimal getFreightPrice() {
		return freightPrice;
	}
	
	public void setTariff(BigDecimal tariff) {
		this.tariff = tariff;
	}
	
	public BigDecimal getTariff() {
		return tariff;
	}
	
	public void setFreightTime(Integer freightTime) {
		this.freightTime = freightTime;
	}
	
	public Integer getFreightTime() {
		return freightTime;
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
	
}
