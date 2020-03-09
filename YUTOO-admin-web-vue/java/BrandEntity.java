package com.yutoo.admin.product.constant.entity;

import java.io.Serializable;
import java.util.Date;



/**
 * 品牌表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月15日 上午9:27:47
 */
public class BrandEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer brandId;
	
	/**
	 * 
	 */
	private String brandNameEn;
	
	/**
	 * 
	 */
	private String brandNameZh;
	
	/**
	 * 负责人
	 */
	private Integer dutyId;
	
	/**
	 * 商户id
	 */
	private Integer merchantId;
	
	/**
	 * 添加人id
	 */
	private Integer operatorId;
	
	/**
	 * 添加人
	 */
	private String operatorName;
	
	/**
	 * logo地址
	 */
	private String logoPath;
	
	/**
	 * 类别链接地址
	 */
	private String categoryLink;
	
	/**
	 * 页面标题
	 */
	private String title;
	
	/**
	 * 页面meta关键词
	 */
	private String metaKeyword;
	
	/**
	 * 页面meta描述
	 */
	private String metaDescription;
	
	/**
	 * 页面模板
	 */
	private String template;
	
	/**
	 * 品牌详细描述
	 */
	private String brandDesc;
	
	/**
	 * 排序
	 */
	private Integer sort;
	
	/**
	 * 是否激活   0.否   1.是
	 */
	private Integer activateFlag;
	
	/**
	 * 
	 */
	private String remark;
	
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
	private String version;
	

	public BrandEntity() {
		super();
	}

	public void setBrandId(Integer brandId) {
		this.brandId = brandId;
	}
	
	public Integer getBrandId() {
		return brandId;
	}
	
	public void setBrandNameEn(String brandNameEn) {
		this.brandNameEn = brandNameEn;
	}
	
	public String getBrandNameEn() {
		return brandNameEn;
	}
	
	public void setBrandNameZh(String brandNameZh) {
		this.brandNameZh = brandNameZh;
	}
	
	public String getBrandNameZh() {
		return brandNameZh;
	}
	
	public void setDutyId(Integer dutyId) {
		this.dutyId = dutyId;
	}
	
	public Integer getDutyId() {
		return dutyId;
	}
	
	public void setMerchantId(Integer merchantId) {
		this.merchantId = merchantId;
	}
	
	public Integer getMerchantId() {
		return merchantId;
	}
	
	public void setOperatorId(Integer operatorId) {
		this.operatorId = operatorId;
	}
	
	public Integer getOperatorId() {
		return operatorId;
	}
	
	public void setOperatorName(String operatorName) {
		this.operatorName = operatorName;
	}
	
	public String getOperatorName() {
		return operatorName;
	}
	
	public void setLogoPath(String logoPath) {
		this.logoPath = logoPath;
	}
	
	public String getLogoPath() {
		return logoPath;
	}
	
	public void setCategoryLink(String categoryLink) {
		this.categoryLink = categoryLink;
	}
	
	public String getCategoryLink() {
		return categoryLink;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getTitle() {
		return title;
	}
	
	public void setMetaKeyword(String metaKeyword) {
		this.metaKeyword = metaKeyword;
	}
	
	public String getMetaKeyword() {
		return metaKeyword;
	}
	
	public void setMetaDescription(String metaDescription) {
		this.metaDescription = metaDescription;
	}
	
	public String getMetaDescription() {
		return metaDescription;
	}
	
	public void setTemplate(String template) {
		this.template = template;
	}
	
	public String getTemplate() {
		return template;
	}
	
	public void setBrandDesc(String brandDesc) {
		this.brandDesc = brandDesc;
	}
	
	public String getBrandDesc() {
		return brandDesc;
	}
	
	public void setSort(Integer sort) {
		this.sort = sort;
	}
	
	public Integer getSort() {
		return sort;
	}
	
	public void setActivateFlag(Integer activateFlag) {
		this.activateFlag = activateFlag;
	}
	
	public Integer getActivateFlag() {
		return activateFlag;
	}
	
	public void setRemark(String remark) {
		this.remark = remark;
	}
	
	public String getRemark() {
		return remark;
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
	
	public void setVersion(String version) {
		this.version = version;
	}
	
	public String getVersion() {
		return version;
	}
	
}
