import main from './main'
import keyword from './keyword'
import searchNatural from './searchNatural'
import searchAdv from './searchAdv'
import searchCate from './searchCate'
import cate from './cate'//类目组件单独
import assAdv from './assAdv'
import assFlow from './assFlow'
import shopAuth from './shopAuth'
import common from './common'
import cateSetup from './cateSetup'
import productCheck from './productCheck'
import cateAnalysis from './cateAnalysis'
import cateDepthAnalysis from './cateDepthAnalysis'
import keywordRankFq from './keywordRankFq'
import adKeyword from './adKeyword'
import ts from './ts'
import productLibrary from './productLibrary'
import badReviewSeo from './badReviewSeo'
import skuEarlyWarning from './skuEarlyWarning'
import ADAnalysis from './ADAnalysis'
import AmazoncateAnalysis from './AmazoncateAnalysis'
import AmazoncateDepthAnalysis from './AmazoncateDepthAnalysis'
import evaluate from './evaluate'
import SFM from './SFM'
import RankingResearch from './RankingResearch'
import FlowWarning from './FlowWarning'
import RelateSource from './RelateSource'
import CO from './CO'
import OTS from './OTS'
import POP from './POP'
import ProductDatasAnalysisWarning from './ProductDatasAnalysisWarning'
import selection from './selection';
import storeAnalysis from './storeAnalysis';
import propertySettings from './propertySettings';
import productIntegration from './productIntegration';
import AmazonClaimsList from './AmazonClaimsList';
import sameCategorySettings from './sameCategorySettings';
import productAttr from './productAttr';
import selectionAttributesCombination from './selectionAttributesCombination';
import newAdAnalysis from './newAdAnalysis'
import brandManage from './brandManage';
import ebayAuth from './ebayAuth';
import ADManualPOP from './ADManualPOP';
import warningMessage from './warningMessage';
import customerMessage from './customerMessage';
import adProductAbnormal from './adProductAbnormal'
import toSell from './toSell/index';
import adTargetingSource from './adTargetingSource';
import newBrandAd from './newBrandAd';
import customerSearch from './customerSearch';
import productPriceOptimization from './productPriceOptimization';
import homeBadReviewMonitoring from './homeBadReviewMonitoring';
import DailyOrderFluctuation from './DailyOrderFluctuation';
import homepage from './homepage';
import kpProduct from './kpProduct';


//ebay的api
import ebayApi from "../ebayApi/index"

export default [...main, ...keyword, ...searchNatural, ...searchAdv,...customerMessage,...adProductAbnormal, ...searchCate, ...cate, ...assAdv,
...assFlow, ...shopAuth, ...common, ...cateSetup,...adTargetingSource,...newBrandAd,...adKeyword, ...productCheck,...customerSearch, ...cateAnalysis, ...cateDepthAnalysis,
...keywordRankFq, ...ts, ...productLibrary, ...badReviewSeo,...newAdAnalysis,...toSell,...skuEarlyWarning, ...ADAnalysis,
...AmazoncateAnalysis, ...AmazoncateDepthAnalysis, ...evaluate, ...SFM, ...RankingResearch, ...FlowWarning, ...RelateSource, ...CO, ...OTS, ...POP, ...ProductDatasAnalysisWarning, ...selection, ...storeAnalysis, ...propertySettings, ...productIntegration, ...AmazonClaimsList, ...sameCategorySettings, ...productAttr, ...selectionAttributesCombination, ...brandManage, ...ebayAuth, ...ebayApi, ...ADManualPOP,...productPriceOptimization , ...homeBadReviewMonitoring,...warningMessage,...DailyOrderFluctuation, ...homepage, ...kpProduct]

