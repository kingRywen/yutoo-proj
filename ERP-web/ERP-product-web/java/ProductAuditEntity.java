package com.yutoo.admin.product.base.entity;

import java.io.Serializable;
import java.util.Date;



/**
 * 产品审核表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月14日 上午9:12:03
 */
public class ProductAuditEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer productAuditId;
	
	/**
	 * 产品母体id
	 */
	private Integer productId;
	
	/**
	 * 审核类型  
枚举 
1.基础信息审核   
2.采购审核

	 */
	private Integer auditType;
	
	/**
	 * 审核状态 1.未审核 2.通过 3.未通过
	 */
	private Integer auditStatus;
	
	/**
	 * 审核理由
	 */
	private String auditReason;
	
	/**
	 * 
	 */
	private Date createTime;
	
	/**
	 * 
	 */
	private Date modifyTime;
	

	public ProductAuditEntity() {
		super();
	}

	public void setProductAuditId(Integer productAuditId) {
		this.productAuditId = productAuditId;
	}
	
	public Integer getProductAuditId() {
		return productAuditId;
	}
	
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	
	public Integer getProductId() {
		return productId;
	}
	
	public void setAuditType(Integer auditType) {
		this.auditType = auditType;
	}
	
	public Integer getAuditType() {
		return auditType;
	}
	
	public void setAuditStatus(Integer auditStatus) {
		this.auditStatus = auditStatus;
	}
	
	public Integer getAuditStatus() {
		return auditStatus;
	}
	
	public void setAuditReason(String auditReason) {
		this.auditReason = auditReason;
	}
	
	public String getAuditReason() {
		return auditReason;
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
