package com.yutoo.admin.product.constant.entity;

import java.io.Serializable;
import java.util.Date;



/**
 * 
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月15日 上午9:27:47
 */
public class WarehouseEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer warehouseId;
	
	/**
	 * 商户id
	 */
	private Integer merchantId;
	
	/**
	 * 仓库名
	 */
	private String warehouseName;
	
	/**
	 * 
	 */
	private Date createTime;
	
	/**
	 * 
	 */
	private Date modifyTime;
	

	public WarehouseEntity() {
		super();
	}

	public void setWarehouseId(Integer warehouseId) {
		this.warehouseId = warehouseId;
	}
	
	public Integer getWarehouseId() {
		return warehouseId;
	}
	
	public void setMerchantId(Integer merchantId) {
		this.merchantId = merchantId;
	}
	
	public Integer getMerchantId() {
		return merchantId;
	}
	
	public void setWarehouseName(String warehouseName) {
		this.warehouseName = warehouseName;
	}
	
	public String getWarehouseName() {
		return warehouseName;
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
