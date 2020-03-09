package com.yutoo.admin.product.constant.entity;

import com.yutoo.admin.product.base.entity.ProductAuditEntity;

import java.util.HashMap;
import java.util.Map;

public class ProductItem {

    /**
     *
     */
    private Integer productId;




    /**
     * 商户id
     */
    private Integer merchantId;

    /**
     * 母体系统sku
     */
    private String sku;

    /**
     * 母体自定义sku
     */
    private String skuCustom;

    /**
     * 默认发货仓库id
     */
    private Integer warehouseId;

    /**
     * 仓库名
     */
    private String warehouseIdString;

    /**
     * 产品来源   枚举 1.新样品  2.销售提报 3.平台采集 4.供应商审核
     */
    private Integer sourceType;

    private String  sourceTypeString;

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
     * 产品规格型号
     */
    private String productSpecification;




    /**
     * 产品状态  枚举1.基础信息编辑 2.基础信息审核  3. 采购信息编辑  4.采购信息审核  5.审核通过   6.基础信息打回  7.采购信息打回  8.作废
     */
    private Integer productBaseStatus;

    private String productBaseStatusString;

    /**
     * 处理人员
     */
    private Integer operatorId;

    private String operatorName;


    /**
     * 母体估算日销量
     */
    private Integer dailyTargetAll;

    /**
     * 是否有变体
     */
    private Boolean showVariant;



    /**
     * 库存
     */
    private Integer repertoryAll;

    /**
     * 产品开发审核状态
     * 1. 基础信息审核  2.采购信息审核
     */
    private Map<Integer, Integer> auditMap = new HashMap<>();

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(Integer merchantId) {
        this.merchantId = merchantId;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getSkuCustom() {
        return skuCustom;
    }

    public void setSkuCustom(String skuCustom) {
        this.skuCustom = skuCustom;
    }

    public Integer getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Integer warehouseId) {
        this.warehouseId = warehouseId;
    }

    public String getWarehouseIdString() {
        return warehouseIdString;
    }

    public void setWarehouseIdString(String warehouseIdString) {
        this.warehouseIdString = warehouseIdString;
    }

    public Integer getSourceType() {
        return sourceType;
    }

    public void setSourceType(Integer sourceType) {
        this.sourceType = sourceType;
    }

    public String getSourceTypeString() {
        return sourceTypeString;
    }

    public void setSourceTypeString(String sourceTypeString) {
        this.sourceTypeString = sourceTypeString;
    }

    public Integer getPhotoFlag() {
        return photoFlag;
    }

    public void setPhotoFlag(Integer photoFlag) {
        this.photoFlag = photoFlag;
    }

    public Integer getRecommendLevel() {
        return recommendLevel;
    }

    public void setRecommendLevel(Integer recommendLevel) {
        this.recommendLevel = recommendLevel;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public String getNameZh() {
        return nameZh;
    }

    public void setNameZh(String nameZh) {
        this.nameZh = nameZh;
    }

    public String getProductSpecification() {
        return productSpecification;
    }

    public void setProductSpecification(String productSpecification) {
        this.productSpecification = productSpecification;
    }

    public Integer getProductBaseStatus() {
        return productBaseStatus;
    }

    public void setProductBaseStatus(Integer productBaseStatus) {
        this.productBaseStatus = productBaseStatus;
    }

    public String getProductBaseStatusString() {
        return productBaseStatusString;
    }

    public void setProductBaseStatusString(String productBaseStatusString) {
        this.productBaseStatusString = productBaseStatusString;
    }

    public Integer getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(Integer operatorId) {
        this.operatorId = operatorId;
    }

    public String getOperatorName() {
        return operatorName;
    }

    public void setOperatorName(String operatorName) {
        this.operatorName = operatorName;
    }

    public Integer getDailyTargetAll() {
        return dailyTargetAll;
    }

    public void setDailyTargetAll(Integer dailyTargetAll) {
        this.dailyTargetAll = dailyTargetAll;
    }

    public Boolean getShowVariant() {
        return showVariant;
    }

    public void setShowVariant(Boolean showVariant) {
        this.showVariant = showVariant;
    }

    public Integer getRepertoryAll() {
        return repertoryAll;
    }

    public void setRepertoryAll(Integer repertoryAll) {
        this.repertoryAll = repertoryAll;
    }

    public Map<Integer, Integer> getAuditMap() {
        return auditMap;
    }

    public void setAuditMap(Map<Integer, Integer> auditMap) {
        this.auditMap = auditMap;
    }
}
