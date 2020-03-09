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
public class ProductPltOperationEntity implements Serializable {
	
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
1平台审核
2图片编辑
3图片审核
4英语平台信息编辑
5法语平台信息编辑
6德语平台信息编辑
7印地语平台信息编辑
8日语平台信息编辑
9西班牙语平台信息编辑
10意大利语平台信息编辑
11俄语平台信息编辑
12阿拉伯语平台信息编辑
13英语平台信息审核
14法语平台信息审核
15德语平台信息审核
16印地语平台信息审核
17日语平台信息审核
18西班牙语平台信息审核
19意大利语平台信息审核
20俄语平台信息审核
21阿拉伯语平台信息审核
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
	 * 平台公共模板id
	 */
	private Integer productPltDetailId;
	
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
	

	public ProductPltOperationEntity() {
		super();
	}

	public ProductPltOperationEntity(Integer productId, Integer operationType, Integer platformId, Integer productPlatformId) {
		this.productId = productId;
		this.operationType = operationType;
		this.platformId = platformId;
		this.productPlatformId = productPlatformId;
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
	
	public void setProductPltDetailId(Integer productPltDetailId) {
		this.productPltDetailId = productPltDetailId;
	}
	
	public Integer getProductPltDetailId() {
		return productPltDetailId;
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
