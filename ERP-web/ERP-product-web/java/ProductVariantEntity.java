package com.yutoo.admin.product.base.entity;

import java.io.Serializable;
import java.util.Date;



/**
 * 产品基本信息表
 *
 * @author YuToo
 * @email 
 * @url 
 * @date 2018年5月16日 下午4:54:08
 */
public class ProductVariantEntity implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 
	 */
	private Integer productId;
	
	/**
	 * 修改时间
	 */
	private Date modifyTime;
	
	/**
	 * 创建时间
	 */
	private Date createTime;
	
	/**
	 * 母体id
	 */
	private Integer parentProductId;
	
	/**
	 * 商户id
	 */
	private Integer merchantId;
	
	/**
	 * 系统sku
	 */
	private String sku;
	
	/**
	 * 自定义sku
	 */
	private String skuCustom;
	
	/**
	 * 默认发货仓库id
	 */
	private Integer warehouseId;
	
	/**
	 * 产品来源   枚举 1.新样品  2.销售提报 3.平台采集 4.供应商审核
	 */
	private Integer sourceType;
	
	/**
	 * 是否需要拍照
枚举
1需要
2不需要
	 */
	private Integer photoFlag;
	
	/**
	 * 推荐指数   0到5
	 */
	private Integer recommendLevel;
	
	/**
	 * 产品英文名（多个名字用分号分割（；））
	 */
	private String nameEn;
	
	/**
	 * 产品中文名
	 */
	private String nameZh;
	
	/**
	 * 海外直采支持
枚举
1，支持
2，不支持
	 */
	private Integer overseaFlag;
	
	/**
	 * 产品侵权风险
枚举：
1，非仿牌
2，仿牌
3，灰色产品

	 */
	private Integer riskType;
	
	/**
	 * 产品类型
枚举：
1，普通产品
2，产品包材
 
	 */
	private Integer productType;
	
	/**
	 * 产品物流属性
枚举：
1，普货
2，纯电池
3，带内置电池
4，带外置电池
5，含纽扣电池
6，液体
7，粉末
8，打火机
9，刀具_剪刀_仿真枪
10，带磁物品
11，其他禁运物品
12，木质类_竹质类
13，膏状
14，易碎
15，动物羽毛类
16，大功率电池
17，电子烟
18，移动电源
19，可拆卸电池
20，厨具
21，电机_马达
22，超体积普
23，超体积非普
24，手机
25，平衡车
26，液体笔类
27，纺织品
28，植物种子
	 */
	private Integer logisticType;
	
	/**
	 * 强电插头
枚举：
1，无
2，有
	 */
	private Integer plugFlag;
	
	/**
	 * 枚举 1.原装美规  2.原装欧规 3.原装英规
3.原装澳规 5.原装日规 6.通用美规  
7.已配美规转接头  8.已配欧规转接头
8.已配澳规转接头 10. 已配日规转接头
中式扁插
	 */
	private Integer plugId;
	
	/**
	 * 商品品牌id
	 */
	private Integer brandId;
	
	/**
	 * 产品类别id
	 */
	private Integer categoryId;
	
	/**
	 * 产品其它的类别(pro_category表的id 
	 */
	private Integer categorySecondId;
	
	/**
	 * 单个产品毛重
	 */
	private Double gw;
	
	/**
	 * 商品净重
	 */
	private Double nw;
	
	/**
	 * 包裹重
	 */
	private Double packageWeight;
	
	/**
	 * 单个产品尺寸(长)
	 */
	private Double singleLong;
	
	/**
	 * 单个产品尺寸(宽)
	 */
	private Double singleWide;
	
	/**
	 * 单个产品尺寸(高)
	 */
	private Double singleHigh;
	
	/**
	 * 单个商品包装尺寸(长)
	 */
	private Double packageLong;
	
	/**
	 * 单个商品包装尺寸(宽)
	 */
	private Double packageWide;
	
	/**
	 * 单个商品包装尺寸(高)
	 */
	private Double packageHigh;
	
	/**
	 * 外箱包装尺寸(长)
	 */
	private Double boxLong;
	
	/**
	 * 外箱包装尺寸(宽)
	 */
	private Double boxWide;
	
	/**
	 * 外箱包装尺寸(高)
	 */
	private Double boxHigh;
	
	/**
	 * 每箱PCS数量
	 */
	private Integer boxAmount;
	
	/**
	 * 整箱产品毛重
	 */
	private Double boxGw;
	
	/**
	 * 整箱产品净重
	 */
	private Double boxNw;
	
	/**
	 * 产品计量单位
	 */
	private Integer unitId;
	
	/**
	 * 产品规格型号
	 */
	private String productSpecification;
	
	/**
	 * 参考网站链接
	 */
	private String referenceLink;
	
	/**
	 * 产品特征亮点
	 */
	private String productFeature;
	
	/**
	 * 包装清单
	 */
	private String packageList;
	
	/**
	 * seo标题
	 */
	private String seoTitle;
	
	/**
	 * seo关键字
	 */
	private String seoKeyword;
	
	/**
	 * 搜索关键字
	 */
	private String searchKeyword;
	
	/**
	 * seo描述
	 */
	private String seoDesc;
	
	/**
	 * 产品模型
	 */
	private Integer modelId;
	
	/**
	 * 产品状态  枚举1.基础信息编辑 2.基础信息审核  3. 采购信息编辑  4.采购信息审核  5.审核通过   6.基础信息打回  7.采购信息打回  8.作废
	 */
	private Integer productBaseStatus;
	
	/**
	 * 预上架平台id   用; 分隔
	 */
	private String platformIds;
	
	/**
	 * 规格名称是否加入变体 1.是 0.否
	 */
	private Integer variantFlag;
	
	/**
	 * 是否共享  1.时 0.否
	 */
	private Integer shareFlag;
	
	/**
	 * 估算日销量
	 */
	private Integer dailyTarget;
	
	/**
	 * 估算周销量
	 */
	private Integer weekTarget;
	
	/**
	 * 估算月销量
	 */
	private Integer monthTarget;
	
	/**
	 * 库存
	 */
	private Integer repertory;
	
	/**
	 * 是否激活
	 */
	private Integer activateFlag;
	
	/**
	 * 备注
	 */
	private String activateRemark;
	

	public ProductVariantEntity() {
		super();
	}

	public void setProductId(Integer productId) {
		this.productId = productId;
	}
	
	public Integer getProductId() {
		return productId;
	}
	
	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}
	
	public Date getModifyTime() {
		return modifyTime;
	}
	
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
	public Date getCreateTime() {
		return createTime;
	}
	
	public void setParentProductId(Integer parentProductId) {
		this.parentProductId = parentProductId;
	}
	
	public Integer getParentProductId() {
		return parentProductId;
	}
	
	public void setMerchantId(Integer merchantId) {
		this.merchantId = merchantId;
	}
	
	public Integer getMerchantId() {
		return merchantId;
	}
	
	public void setSku(String sku) {
		this.sku = sku;
	}
	
	public String getSku() {
		return sku;
	}
	
	public void setSkuCustom(String skuCustom) {
		this.skuCustom = skuCustom;
	}
	
	public String getSkuCustom() {
		return skuCustom;
	}
	
	public void setWarehouseId(Integer warehouseId) {
		this.warehouseId = warehouseId;
	}
	
	public Integer getWarehouseId() {
		return warehouseId;
	}
	
	public void setSourceType(Integer sourceType) {
		this.sourceType = sourceType;
	}
	
	public Integer getSourceType() {
		return sourceType;
	}
	
	public void setPhotoFlag(Integer photoFlag) {
		this.photoFlag = photoFlag;
	}
	
	public Integer getPhotoFlag() {
		return photoFlag;
	}
	
	public void setRecommendLevel(Integer recommendLevel) {
		this.recommendLevel = recommendLevel;
	}
	
	public Integer getRecommendLevel() {
		return recommendLevel;
	}
	
	public void setNameEn(String nameEn) {
		this.nameEn = nameEn;
	}
	
	public String getNameEn() {
		return nameEn;
	}
	
	public void setNameZh(String nameZh) {
		this.nameZh = nameZh;
	}
	
	public String getNameZh() {
		return nameZh;
	}
	
	public void setOverseaFlag(Integer overseaFlag) {
		this.overseaFlag = overseaFlag;
	}
	
	public Integer getOverseaFlag() {
		return overseaFlag;
	}
	
	public void setRiskType(Integer riskType) {
		this.riskType = riskType;
	}
	
	public Integer getRiskType() {
		return riskType;
	}
	
	public void setProductType(Integer productType) {
		this.productType = productType;
	}
	
	public Integer getProductType() {
		return productType;
	}
	
	public void setLogisticType(Integer logisticType) {
		this.logisticType = logisticType;
	}
	
	public Integer getLogisticType() {
		return logisticType;
	}
	
	public void setPlugFlag(Integer plugFlag) {
		this.plugFlag = plugFlag;
	}
	
	public Integer getPlugFlag() {
		return plugFlag;
	}
	
	public void setPlugId(Integer plugId) {
		this.plugId = plugId;
	}
	
	public Integer getPlugId() {
		return plugId;
	}
	
	public void setBrandId(Integer brandId) {
		this.brandId = brandId;
	}
	
	public Integer getBrandId() {
		return brandId;
	}
	
	public void setCategoryId(Integer categoryId) {
		this.categoryId = categoryId;
	}
	
	public Integer getCategoryId() {
		return categoryId;
	}
	
	public void setCategorySecondId(Integer categorySecondId) {
		this.categorySecondId = categorySecondId;
	}
	
	public Integer getCategorySecondId() {
		return categorySecondId;
	}
	
	public void setGw(Double gw) {
		this.gw = gw;
	}
	
	public Double getGw() {
		return gw;
	}
	
	public void setNw(Double nw) {
		this.nw = nw;
	}
	
	public Double getNw() {
		return nw;
	}
	
	public void setPackageWeight(Double packageWeight) {
		this.packageWeight = packageWeight;
	}
	
	public Double getPackageWeight() {
		return packageWeight;
	}
	
	public void setSingleLong(Double singleLong) {
		this.singleLong = singleLong;
	}
	
	public Double getSingleLong() {
		return singleLong;
	}
	
	public void setSingleWide(Double singleWide) {
		this.singleWide = singleWide;
	}
	
	public Double getSingleWide() {
		return singleWide;
	}
	
	public void setSingleHigh(Double singleHigh) {
		this.singleHigh = singleHigh;
	}
	
	public Double getSingleHigh() {
		return singleHigh;
	}
	
	public void setPackageLong(Double packageLong) {
		this.packageLong = packageLong;
	}
	
	public Double getPackageLong() {
		return packageLong;
	}
	
	public void setPackageWide(Double packageWide) {
		this.packageWide = packageWide;
	}
	
	public Double getPackageWide() {
		return packageWide;
	}
	
	public void setPackageHigh(Double packageHigh) {
		this.packageHigh = packageHigh;
	}
	
	public Double getPackageHigh() {
		return packageHigh;
	}
	
	public void setBoxLong(Double boxLong) {
		this.boxLong = boxLong;
	}
	
	public Double getBoxLong() {
		return boxLong;
	}
	
	public void setBoxWide(Double boxWide) {
		this.boxWide = boxWide;
	}
	
	public Double getBoxWide() {
		return boxWide;
	}
	
	public void setBoxHigh(Double boxHigh) {
		this.boxHigh = boxHigh;
	}
	
	public Double getBoxHigh() {
		return boxHigh;
	}
	
	public void setBoxAmount(Integer boxAmount) {
		this.boxAmount = boxAmount;
	}
	
	public Integer getBoxAmount() {
		return boxAmount;
	}
	
	public void setBoxGw(Double boxGw) {
		this.boxGw = boxGw;
	}
	
	public Double getBoxGw() {
		return boxGw;
	}
	
	public void setBoxNw(Double boxNw) {
		this.boxNw = boxNw;
	}
	
	public Double getBoxNw() {
		return boxNw;
	}
	
	public void setUnitId(Integer unitId) {
		this.unitId = unitId;
	}
	
	public Integer getUnitId() {
		return unitId;
	}
	
	public void setProductSpecification(String productSpecification) {
		this.productSpecification = productSpecification;
	}
	
	public String getProductSpecification() {
		return productSpecification;
	}
	
	public void setReferenceLink(String referenceLink) {
		this.referenceLink = referenceLink;
	}
	
	public String getReferenceLink() {
		return referenceLink;
	}
	
	public void setProductFeature(String productFeature) {
		this.productFeature = productFeature;
	}
	
	public String getProductFeature() {
		return productFeature;
	}
	
	public void setPackageList(String packageList) {
		this.packageList = packageList;
	}
	
	public String getPackageList() {
		return packageList;
	}
	
	public void setSeoTitle(String seoTitle) {
		this.seoTitle = seoTitle;
	}
	
	public String getSeoTitle() {
		return seoTitle;
	}
	
	public void setSeoKeyword(String seoKeyword) {
		this.seoKeyword = seoKeyword;
	}
	
	public String getSeoKeyword() {
		return seoKeyword;
	}
	
	public void setSearchKeyword(String searchKeyword) {
		this.searchKeyword = searchKeyword;
	}
	
	public String getSearchKeyword() {
		return searchKeyword;
	}
	
	public void setSeoDesc(String seoDesc) {
		this.seoDesc = seoDesc;
	}
	
	public String getSeoDesc() {
		return seoDesc;
	}
	
	public void setModelId(Integer modelId) {
		this.modelId = modelId;
	}
	
	public Integer getModelId() {
		return modelId;
	}
	
	public void setProductBaseStatus(Integer productBaseStatus) {
		this.productBaseStatus = productBaseStatus;
	}
	
	public Integer getProductBaseStatus() {
		return productBaseStatus;
	}
	
	public void setPlatformIds(String platformIds) {
		this.platformIds = platformIds;
	}
	
	public String getPlatformIds() {
		return platformIds;
	}
	
	public void setVariantFlag(Integer variantFlag) {
		this.variantFlag = variantFlag;
	}
	
	public Integer getVariantFlag() {
		return variantFlag;
	}
	
	public void setShareFlag(Integer shareFlag) {
		this.shareFlag = shareFlag;
	}
	
	public Integer getShareFlag() {
		return shareFlag;
	}
	
	public void setDailyTarget(Integer dailyTarget) {
		this.dailyTarget = dailyTarget;
	}
	
	public Integer getDailyTarget() {
		return dailyTarget;
	}
	
	public void setWeekTarget(Integer weekTarget) {
		this.weekTarget = weekTarget;
	}
	
	public Integer getWeekTarget() {
		return weekTarget;
	}
	
	public void setMonthTarget(Integer monthTarget) {
		this.monthTarget = monthTarget;
	}
	
	public Integer getMonthTarget() {
		return monthTarget;
	}
	
	public void setRepertory(Integer repertory) {
		this.repertory = repertory;
	}
	
	public Integer getRepertory() {
		return repertory;
	}
	
	public void setActivateFlag(Integer activateFlag) {
		this.activateFlag = activateFlag;
	}
	
	public Integer getActivateFlag() {
		return activateFlag;
	}
	
	public void setActivateRemark(String activateRemark) {
		this.activateRemark = activateRemark;
	}
	
	public String getActivateRemark() {
		return activateRemark;
	}
	
}
