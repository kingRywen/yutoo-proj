package com.yutoo.admin.product.constant.entity;

import java.math.BigDecimal;
import java.util.Date;

public class VariantItem {

    /**
     * 关联表id
     */
    private Integer variantRelId;


    /**
     * 主产品母体id

     */
    private Integer parentId;

    /**
     *主产品变体id
     */
    private Integer productId;

    /**
     *关联变体id
     */
    private Integer relVariantId;

    /**
     * 关联变体sku
     */
    private String variantSku;

    /**
     * 关联变体自定义sku
     */
    private String variantSkuCustom;

    /**
     * 变体中文名
     */
    private String variantNameZh;

    private String variantNameEn;

    /**
     * 关联种类   1，产品配件2.成品原料 3.运输包材，4运输包材
     */
    private Integer relType;

    /**
     * 数量
     */
    private Integer relNum;

    /**
     * 规格参数
     */
    private String specification;


    /**
     * 关联变体主图压缩图路径
     */
    private String variantImg;

    /**
     * 添加时间
     */
    private Date createTime;


    /**
     * 售价
     */
    private BigDecimal salePrice;

    /**
     * 供货价
     */
    private BigDecimal supplierPrice;

    /**
     * 本仓估算日销量
     */
    private Integer dailyTarget;

    /**
     * 库存
     */
    private Integer repertory;

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
     * 默认发货仓库id
     */
    private Integer warehouseId;

    /**
     * 仓库名
     */
    private String warehouseIdString;


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

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }


    public String getVariantNameEn() {
        return variantNameEn;
    }

    public void setVariantNameEn(String variantNameEn) {
        this.variantNameEn = variantNameEn;
    }

    public BigDecimal getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(BigDecimal salePrice) {
        this.salePrice = salePrice;
    }

    public BigDecimal getSupplierPrice() {
        return supplierPrice;
    }

    public void setSupplierPrice(BigDecimal supplierPrice) {
        this.supplierPrice = supplierPrice;
    }

    public Integer getDailyTarget() {
        return dailyTarget;
    }

    public void setDailyTarget(Integer dailyTarget) {
        this.dailyTarget = dailyTarget;
    }

    public Integer getRepertory() {
        return repertory;
    }

    public void setRepertory(Integer repertory) {
        this.repertory = repertory;
    }

    public String getVariantSkuCustom() {
        return variantSkuCustom;
    }

    public void setVariantSkuCustom(String variantSkuCustom) {
        this.variantSkuCustom = variantSkuCustom;
    }

    public String getVariantImg() {
        return variantImg;
    }

    public void setVariantImg(String variantImg) {
        this.variantImg = variantImg;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }


    public String getSpecification() {
        return specification;
    }

    public void setSpecification(String specification) {
        this.specification = specification;
    }



    public Integer getVariantRelId() {
        return variantRelId;
    }

    public void setVariantRelId(Integer variantRelId) {
        this.variantRelId = variantRelId;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public Integer getRelVariantId() {
        return relVariantId;
    }

    public void setRelVariantId(Integer relVariantId) {
        this.relVariantId = relVariantId;
    }

    public String getVariantSku() {
        return variantSku;
    }

    public void setVariantSku(String variantSku) {
        this.variantSku = variantSku;
    }

    public String getVariantNameZh() {
        return variantNameZh;
    }

    public void setVariantNameZh(String variantNameZh) {
        this.variantNameZh = variantNameZh;
    }

    public Integer getRelType() {
        return relType;
    }

    public void setRelType(Integer relType) {
        this.relType = relType;
    }

    public Integer getRelNum() {
        return relNum;
    }

    public void setRelNum(Integer relNum) {
        this.relNum = relNum;
    }


}
