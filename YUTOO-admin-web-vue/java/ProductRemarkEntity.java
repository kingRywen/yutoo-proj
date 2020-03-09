package com.yutoo.admin.product.base.entity;

import java.io.Serializable;
import java.util.Date;



/**
 * 产品备注表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月14日 上午9:12:03
 */
public class ProductRemarkEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer productRemarkId;
	
	/**
	 * 母体id或变体id
	 */
	private Integer productId;
	
	/**
	 * 产品是否预售  枚举   1 预售   0 不预售
	 */
	private Integer persellFlag;
	
	/**
	 * 预售到货日期
	 */
	private Date presellTime;
	
	/**
	 * 出售起始时间
	 */
	private Date saleTimeStart;
	
	/**
	 * 
	 */
	private Date saleTimeEnd;
	
	/**
	 * 开发备注
	 */
	private String developRemark;
	
	/**
	 * 采购收货备注
	 */
	private String purchaseRemark;
	
	/**
	 * 产品打包状态    枚举1.不需打包 2.需自行打包 3. 供应商打包
	 */
	private String packageType;
	
	/**
	 * 产品备注      富文本html路径
	 */
	private String productRemarkPath;
	
	/**
	 * 图片处理备注
	 */
	private String imgRemark;
	
	/**
	 * 质检备注      富文本html路径
	 */
	private String qcRemarkPath;
	
	/**
	 * 发货打包备注   富文本html路径
	 */
	private String shipmentRemarkPath;
	
	/**
	 * 上传附件路径 
	 */
	private String attachmentRemarkPath;
	
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
	

	public ProductRemarkEntity() {
		super();
	}

	public void setProductRemarkId(Integer productRemarkId) {
		this.productRemarkId = productRemarkId;
	}
	
	public Integer getProductRemarkId() {
		return productRemarkId;
	}
	
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	
	public Integer getProductId() {
		return productId;
	}
	
	public void setPersellFlag(Integer persellFlag) {
		this.persellFlag = persellFlag;
	}
	
	public Integer getPersellFlag() {
		return persellFlag;
	}
	
	public void setPresellTime(Date presellTime) {
		this.presellTime = presellTime;
	}
	
	public Date getPresellTime() {
		return presellTime;
	}
	
	public void setSaleTimeStart(Date saleTimeStart) {
		this.saleTimeStart = saleTimeStart;
	}
	
	public Date getSaleTimeStart() {
		return saleTimeStart;
	}
	
	public void setSaleTimeEnd(Date saleTimeEnd) {
		this.saleTimeEnd = saleTimeEnd;
	}
	
	public Date getSaleTimeEnd() {
		return saleTimeEnd;
	}
	
	public void setDevelopRemark(String developRemark) {
		this.developRemark = developRemark;
	}
	
	public String getDevelopRemark() {
		return developRemark;
	}
	
	public void setPurchaseRemark(String purchaseRemark) {
		this.purchaseRemark = purchaseRemark;
	}
	
	public String getPurchaseRemark() {
		return purchaseRemark;
	}
	
	public void setPackageType(String packageType) {
		this.packageType = packageType;
	}
	
	public String getPackageType() {
		return packageType;
	}
	
	public void setProductRemarkPath(String productRemarkPath) {
		this.productRemarkPath = productRemarkPath;
	}
	
	public String getProductRemarkPath() {
		return productRemarkPath;
	}
	
	public void setImgRemark(String imgRemark) {
		this.imgRemark = imgRemark;
	}
	
	public String getImgRemark() {
		return imgRemark;
	}
	
	public void setQcRemarkPath(String qcRemarkPath) {
		this.qcRemarkPath = qcRemarkPath;
	}
	
	public String getQcRemarkPath() {
		return qcRemarkPath;
	}
	
	public void setShipmentRemarkPath(String shipmentRemarkPath) {
		this.shipmentRemarkPath = shipmentRemarkPath;
	}
	
	public String getShipmentRemarkPath() {
		return shipmentRemarkPath;
	}
	
	public void setAttachmentRemarkPath(String attachmentRemarkPath) {
		this.attachmentRemarkPath = attachmentRemarkPath;
	}
	
	public String getAttachmentRemarkPath() {
		return attachmentRemarkPath;
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
