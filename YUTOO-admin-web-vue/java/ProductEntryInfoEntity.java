package com.yutoo.admin.product.purchase.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;



/**
 * 报关信息表

 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月16日 下午4:14:16
 */
public class ProductEntryInfoEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer productEntryInfoId;
	
	/**
	 * 
	 */
	private Integer productId;
	
	/**
	 * 产品英文标题
	 */
	private String titleEn;
	
	/**
	 * 
	 */
	private String entryNameEn;
	
	/**
	 * 
	 */
	private String entryNameZh;
	
	/**
	 * 产品用途
	 */
	private String productApplication;
	
	/**
	 * 报关材质
	 */
	private String entryMaterial;
	
	/**
	 * 海关编码
	 */
	private String hsCode;
	
	/**
	 * 是否审核海关编码  1 审核   0 不审核
	 */
	private Integer hsCodeAudit;
	
	/**
	 * 退税率
	 */
	private BigDecimal refundRate;
	
	/**
	 * 报关价  默认转换为美元 默认供货价的40%
	 */
	private BigDecimal entryPrice;
	
	/**
	 * 报关单位
	 */
	private String entryUnit;
	
	/**
	 * 欧洲报关链接  
	 */
	private String europeEntryLink;
	
	/**
	 * 欧洲报关价格  默认转换成欧元 低于10欧元的默认加2欧作运费
	 */
	private BigDecimal europeEntryPrice;
	
	/**
	 * 申报要素
	 */
	private String declareElement;
	
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
	

	public ProductEntryInfoEntity() {
		super();
	}

	public void setProductEntryInfoId(Integer productEntryInfoId) {
		this.productEntryInfoId = productEntryInfoId;
	}
	
	public Integer getProductEntryInfoId() {
		return productEntryInfoId;
	}
	
	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	
	public Integer getProductId() {
		return productId;
	}
	
	public void setTitleEn(String titleEn) {
		this.titleEn = titleEn;
	}
	
	public String getTitleEn() {
		return titleEn;
	}
	
	public void setEntryNameEn(String entryNameEn) {
		this.entryNameEn = entryNameEn;
	}
	
	public String getEntryNameEn() {
		return entryNameEn;
	}
	
	public void setEntryNameZh(String entryNameZh) {
		this.entryNameZh = entryNameZh;
	}
	
	public String getEntryNameZh() {
		return entryNameZh;
	}
	
	public void setProductApplication(String productApplication) {
		this.productApplication = productApplication;
	}
	
	public String getProductApplication() {
		return productApplication;
	}
	
	public void setEntryMaterial(String entryMaterial) {
		this.entryMaterial = entryMaterial;
	}
	
	public String getEntryMaterial() {
		return entryMaterial;
	}
	
	public void setHsCode(String hsCode) {
		this.hsCode = hsCode;
	}
	
	public String getHsCode() {
		return hsCode;
	}
	
	public void setHsCodeAudit(Integer hsCodeAudit) {
		this.hsCodeAudit = hsCodeAudit;
	}
	
	public Integer getHsCodeAudit() {
		return hsCodeAudit;
	}
	
	public void setRefundRate(BigDecimal refundRate) {
		this.refundRate = refundRate;
	}
	
	public BigDecimal getRefundRate() {
		return refundRate;
	}
	
	public void setEntryPrice(BigDecimal entryPrice) {
		this.entryPrice = entryPrice;
	}
	
	public BigDecimal getEntryPrice() {
		return entryPrice;
	}
	
	public void setEntryUnit(String entryUnit) {
		this.entryUnit = entryUnit;
	}
	
	public String getEntryUnit() {
		return entryUnit;
	}
	
	public void setEuropeEntryLink(String europeEntryLink) {
		this.europeEntryLink = europeEntryLink;
	}
	
	public String getEuropeEntryLink() {
		return europeEntryLink;
	}
	
	public void setEuropeEntryPrice(BigDecimal europeEntryPrice) {
		this.europeEntryPrice = europeEntryPrice;
	}
	
	public BigDecimal getEuropeEntryPrice() {
		return europeEntryPrice;
	}
	
	public void setDeclareElement(String declareElement) {
		this.declareElement = declareElement;
	}
	
	public String getDeclareElement() {
		return declareElement;
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
