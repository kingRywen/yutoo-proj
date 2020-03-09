package com.yutoo.admin.product.base.entity;

import java.io.Serializable;
import java.util.Date;



/**
 * 产品操作表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月14日 上午9:12:03
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
2.采购信息编辑
3.基础信息审核
4.采购审核
5.平台审核
6.图片审核
7.平台信息审核
8.图片编辑
9.上架信息编辑
10.英语平台信息编辑
11.法语平台信息编辑
12.德语平台信息编辑
13.印地语平台信息编辑
14.日语平台信息编辑
15.西班牙语平台信息编辑
16.意大利语平台信息编辑
17.俄语平台信息编辑
18.阿拉伯语平台信息编辑
15.俄语平台信息编辑
阿拉伯语平台信息编辑
	 */
	private Integer operationType;
	
	/**
	 * 操作完成时间
	 */
	private Date operationTime;
	
	/**
	 * 
	 */
	private Integer platformId;
	
	/**
	 * 平台产品id
	 */
	private Integer productPlatformId;
	
	/**
	 * 语种id
	 */
	private Integer languageId;
	
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
	
	public void setPlatformId(Integer platformId) {
		this.platformId = platformId;
	}
	
	public Integer getPlatformId() {
		return platformId;
	}
	
	public void setProductPlatformId(Integer productPlatformId) {
		this.productPlatformId = productPlatformId;
	}
	
	public Integer getProductPlatformId() {
		return productPlatformId;
	}
	
	public void setLanguageId(Integer languageId) {
		this.languageId = languageId;
	}
	
	public Integer getLanguageId() {
		return languageId;
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
