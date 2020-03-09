package com.yutoo.admin.product.base.entity;

import java.io.Serializable;
import java.util.Date;



/**
 * 图片表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月14日 上午9:12:03
 */
public class ProductImgEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer productImgId;
	
	/**
	 * 
	 */
	private Integer productId;
	
	/**
	 * 
	 */
	private String imgName;
	
	/**
	 * 图片路径
	 */
	private String imgPath;
	
	/**
	 * 压缩图路径
	 */
	private String imgPathM;
	
	/**
	 * 图片展示的类型 枚举  1.主图   0.非主图
	 */
	private Integer imgShowFlag;
	
	/**
	 * 图片所属  1.基础信息  2. 采购信息
	 */
	private Integer originalType;
	
	/**
	 * 单张图片大小  kb
	 */
	private Long singleSize;
	
	/**
	 * 单张图片备注
	 */
	private String singleRemark;
	
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
	

	public ProductImgEntity() {
		super();
	}

	public void setProductImgId(Integer productImgId) {
		this.productImgId = productImgId;
	}
	
	public Integer getProductImgId() {
		return productImgId;
	}
	
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	
	public Integer getProductId() {
		return productId;
	}
	
	public void setImgName(String imgName) {
		this.imgName = imgName;
	}
	
	public String getImgName() {
		return imgName;
	}
	
	public void setImgPath(String imgPath) {
		this.imgPath = imgPath;
	}
	
	public String getImgPath() {
		return imgPath;
	}
	
	public void setImgPathM(String imgPathM) {
		this.imgPathM = imgPathM;
	}
	
	public String getImgPathM() {
		return imgPathM;
	}
	
	public void setImgShowFlag(Integer imgShowFlag) {
		this.imgShowFlag = imgShowFlag;
	}
	
	public Integer getImgShowFlag() {
		return imgShowFlag;
	}
	
	public void setOriginalType(Integer originalType) {
		this.originalType = originalType;
	}
	
	public Integer getOriginalType() {
		return originalType;
	}
	
	public void setSingleSize(Long singleSize) {
		this.singleSize = singleSize;
	}
	
	public Long getSingleSize() {
		return singleSize;
	}
	
	public void setSingleRemark(String singleRemark) {
		this.singleRemark = singleRemark;
	}
	
	public String getSingleRemark() {
		return singleRemark;
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
