package com.yutoo.admin.product.constant.entity;

import java.io.Serializable;
import java.util.Date;



/**
 * 产品操作表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月16日 上午11:44:27
 */
public class ProductOperationEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer productOperationId;
	
	/**
	 * 产品id
	 */
	private Integer productId;
	
	/**
	 * 操作人id
	 */
	private Integer operatorId;
	
	/**
	 * 操作类型   枚举：
1.基础信息编辑
2.基础信息审核
3.采购信息编辑
4.采购信息审核
	 */
	private Integer operationType;
	
	/**
	 * 操作完成时间
	 */
	private Date operationTime;
	
	/**
	 * 
	 */
	private Date createTime;
	
	/**
	 * 
	 */
	private Date modifyTime;
	

	public ProductOperationEntity() {
		super();
	}

	public void setProductOperationId(Integer productOperationId) {
		this.productOperationId = productOperationId;
	}
	
	public Integer getProductOperationId() {
		return productOperationId;
	}
	
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	
	public Integer getProductId() {
		return productId;
	}
	
	public void setOperatorId(Integer operatorId) {
		this.operatorId = operatorId;
	}
	
	public Integer getOperatorId() {
		return operatorId;
	}
	
	public void setOperationType(Integer operationType) {
		this.operationType = operationType;
	}
	
	public Integer getOperationType() {
		return operationType;
	}
	
	public void setOperationTime(Date operationTime) {
		this.operationTime = operationTime;
	}
	
	public Date getOperationTime() {
		return operationTime;
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
