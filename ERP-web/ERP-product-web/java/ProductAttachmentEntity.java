package com.yutoo.admin.product.base.entity;

import java.io.Serializable;
import java.util.Date;



/**
 * 产品附件表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月15日 下午1:03:55
 */
public class ProductAttachmentEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer productAttachmentId;
	
	/**
	 * 变体id
	 */
	private Integer productId;
	
	/**
	 * 附件名
	 */
	private String attachmentName;
	
	/**
	 * 附件路径
	 */
	private String attachmentPath;
	
	/**
	 * 文件大小 kb
	 */
	private Double fileSize;
	
	/**
	 * 
	 */
	private Date createTime;
	
	/**
	 * 
	 */
	private Date modifyTime;
	

	public ProductAttachmentEntity() {
		super();
	}

	public void setProductAttachmentId(Integer productAttachmentId) {
		this.productAttachmentId = productAttachmentId;
	}
	
	public Integer getProductAttachmentId() {
		return productAttachmentId;
	}
	
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	
	public Integer getProductId() {
		return productId;
	}
	
	public void setAttachmentName(String attachmentName) {
		this.attachmentName = attachmentName;
	}
	
	public String getAttachmentName() {
		return attachmentName;
	}
	
	public void setAttachmentPath(String attachmentPath) {
		this.attachmentPath = attachmentPath;
	}
	
	public String getAttachmentPath() {
		return attachmentPath;
	}
	
	public void setFileSize(Double fileSize) {
		this.fileSize = fileSize;
	}
	
	public Double getFileSize() {
		return fileSize;
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
