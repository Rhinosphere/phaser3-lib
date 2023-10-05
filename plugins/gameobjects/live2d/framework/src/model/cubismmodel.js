/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismFramework } from '../live2dcubismframework';
import { CubismBlendMode } from '../rendering/cubismrenderer';
import { csmMap } from '../type/csmmap';
import { csmVector } from '../type/csmvector';
import { CSM_ASSERT } from '../utils/cubismdebug';
/**
 * モデル
 *
 * Mocデータから生成されるモデルのクラス。
 */
export class CubismModel {
    /**
     * モデルのパラメータの更新
     */
    update() {
        // Update model
        this._model.update();
        this._model.drawables.resetDynamicFlags();
    }
    /**
     * キャンバスの幅を取得する
     */
    getCanvasWidth() {
        if (this._model == null) {
            return 0.0;
        }
        return (this._model.canvasinfo.CanvasWidth / this._model.canvasinfo.PixelsPerUnit);
    }
    /**
     * キャンバスの高さを取得する
     */
    getCanvasHeight() {
        if (this._model == null) {
            return 0.0;
        }
        return (this._model.canvasinfo.CanvasHeight / this._model.canvasinfo.PixelsPerUnit);
    }
    /**
     * パラメータを保存する
     */
    saveParameters() {
        const parameterCount = this._model.parameters.count;
        const savedParameterCount = this._savedParameters.getSize();
        for (let i = 0; i < parameterCount; ++i) {
            if (i < savedParameterCount) {
                this._savedParameters.set(i, this._parameterValues[i]);
            }
            else {
                this._savedParameters.pushBack(this._parameterValues[i]);
            }
        }
    }
    /**
     * モデルを取得
     */
    getModel() {
        return this._model;
    }
    /**
     * パーツのインデックスを取得
     * @param partId パーツのID
     * @return パーツのインデックス
     */
    getPartIndex(partId) {
        let partIndex;
        const partCount = this._model.parts.count;
        for (partIndex = 0; partIndex < partCount; ++partIndex) {
            if (partId == this._partIds.at(partIndex)) {
                return partIndex;
            }
        }
        // モデルに存在していない場合、非存在パーツIDリスト内にあるかを検索し、そのインデックスを返す
        if (this._notExistPartId.isExist(partId)) {
            return this._notExistPartId.getValue(partId);
        }
        // 非存在パーツIDリストにない場合、新しく要素を追加する
        partIndex = partCount + this._notExistPartId.getSize();
        this._notExistPartId.setValue(partId, partIndex);
        this._notExistPartOpacities.appendKey(partIndex);
        return partIndex;
    }
    /**
     * パーツの個数の取得
     * @return パーツの個数
     */
    getPartCount() {
        const partCount = this._model.parts.count;
        return partCount;
    }
    /**
     * パーツの不透明度の設定(Index)
     * @param partIndex パーツのインデックス
     * @param opacity 不透明度
     */
    setPartOpacityByIndex(partIndex, opacity) {
        if (this._notExistPartOpacities.isExist(partIndex)) {
            this._notExistPartOpacities.setValue(partIndex, opacity);
            return;
        }
        // インデックスの範囲内検知
        CSM_ASSERT(0 <= partIndex && partIndex < this.getPartCount());
        this._partOpacities[partIndex] = opacity;
    }
    /**
     * パーツの不透明度の設定(Id)
     * @param partId パーツのID
     * @param opacity パーツの不透明度
     */
    setPartOpacityById(partId, opacity) {
        // 高速化のためにPartIndexを取得できる機構になっているが、外部からの設定の時は呼び出し頻度が低いため不要
        const index = this.getPartIndex(partId);
        if (index < 0) {
            return; // パーツがないのでスキップ
        }
        this.setPartOpacityByIndex(index, opacity);
    }
    /**
     * パーツの不透明度の取得(index)
     * @param partIndex パーツのインデックス
     * @return パーツの不透明度
     */
    getPartOpacityByIndex(partIndex) {
        if (this._notExistPartOpacities.isExist(partIndex)) {
            // モデルに存在しないパーツIDの場合、非存在パーツリストから不透明度を返す。
            return this._notExistPartOpacities.getValue(partIndex);
        }
        // インデックスの範囲内検知
        CSM_ASSERT(0 <= partIndex && partIndex < this.getPartCount());
        return this._partOpacities[partIndex];
    }
    /**
     * パーツの不透明度の取得(id)
     * @param partId パーツのＩｄ
     * @return パーツの不透明度
     */
    getPartOpacityById(partId) {
        // 高速化のためにPartIndexを取得できる機構になっているが、外部からの設定の時は呼び出し頻度が低いため不要
        const index = this.getPartIndex(partId);
        if (index < 0) {
            return 0; // パーツが無いのでスキップ
        }
        return this.getPartOpacityByIndex(index);
    }
    /**
     * パラメータのインデックスの取得
     * @param パラメータID
     * @return パラメータのインデックス
     */
    getParameterIndex(parameterId) {
        let parameterIndex;
        const idCount = this._model.parameters.count;
        for (parameterIndex = 0; parameterIndex < idCount; ++parameterIndex) {
            if (parameterId != this._parameterIds.at(parameterIndex)) {
                continue;
            }
            return parameterIndex;
        }
        // モデルに存在していない場合、非存在パラメータIDリスト内を検索し、そのインデックスを返す
        if (this._notExistParameterId.isExist(parameterId)) {
            return this._notExistParameterId.getValue(parameterId);
        }
        // 非存在パラメータIDリストにない場合新しく要素を追加する
        parameterIndex =
            this._model.parameters.count + this._notExistParameterId.getSize();
        this._notExistParameterId.setValue(parameterId, parameterIndex);
        this._notExistParameterValues.appendKey(parameterIndex);
        return parameterIndex;
    }
    /**
     * パラメータの個数の取得
     * @return パラメータの個数
     */
    getParameterCount() {
        return this._model.parameters.count;
    }
    /**
     * パラメータの最大値の取得
     * @param parameterIndex パラメータのインデックス
     * @return パラメータの最大値
     */
    getParameterMaximumValue(parameterIndex) {
        return this._model.parameters.maximumValues[parameterIndex];
    }
    /**
     * パラメータの最小値の取得
     * @param parameterIndex パラメータのインデックス
     * @return パラメータの最小値
     */
    getParameterMinimumValue(parameterIndex) {
        return this._model.parameters.minimumValues[parameterIndex];
    }
    /**
     * パラメータのデフォルト値の取得
     * @param parameterIndex パラメータのインデックス
     * @return パラメータのデフォルト値
     */
    getParameterDefaultValue(parameterIndex) {
        return this._model.parameters.defaultValues[parameterIndex];
    }
    /**
     * パラメータの値の取得
     * @param parameterIndex    パラメータのインデックス
     * @return パラメータの値
     */
    getParameterValueByIndex(parameterIndex) {
        if (this._notExistParameterValues.isExist(parameterIndex)) {
            return this._notExistParameterValues.getValue(parameterIndex);
        }
        // インデックスの範囲内検知
        CSM_ASSERT(0 <= parameterIndex && parameterIndex < this.getParameterCount());
        return this._parameterValues[parameterIndex];
    }
    /**
     * パラメータの値の取得
     * @param parameterId    パラメータのID
     * @return パラメータの値
     */
    getParameterValueById(parameterId) {
        // 高速化のためにparameterIndexを取得できる機構になっているが、外部からの設定の時は呼び出し頻度が低いため不要
        const parameterIndex = this.getParameterIndex(parameterId);
        return this.getParameterValueByIndex(parameterIndex);
    }
    /**
     * パラメータの値の設定
     * @param parameterIndex パラメータのインデックス
     * @param value パラメータの値
     * @param weight 重み
     */
    setParameterValueByIndex(parameterIndex, value, weight = 1.0) {
        if (this._notExistParameterValues.isExist(parameterIndex)) {
            this._notExistParameterValues.setValue(parameterIndex, weight == 1
                ? value
                : this._notExistParameterValues.getValue(parameterIndex) *
                    (1 - weight) +
                    value * weight);
            return;
        }
        // インデックスの範囲内検知
        CSM_ASSERT(0 <= parameterIndex && parameterIndex < this.getParameterCount());
        if (this._model.parameters.maximumValues[parameterIndex] < value) {
            value = this._model.parameters.maximumValues[parameterIndex];
        }
        if (this._model.parameters.minimumValues[parameterIndex] > value) {
            value = this._model.parameters.minimumValues[parameterIndex];
        }
        this._parameterValues[parameterIndex] =
            weight == 1
                ? value
                : (this._parameterValues[parameterIndex] =
                    this._parameterValues[parameterIndex] * (1 - weight) +
                        value * weight);
    }
    /**
     * パラメータの値の設定
     * @param parameterId パラメータのID
     * @param value パラメータの値
     * @param weight 重み
     */
    setParameterValueById(parameterId, value, weight = 1.0) {
        const index = this.getParameterIndex(parameterId);
        this.setParameterValueByIndex(index, value, weight);
    }
    /**
     * パラメータの値の加算(index)
     * @param parameterIndex パラメータインデックス
     * @param value 加算する値
     * @param weight 重み
     */
    addParameterValueByIndex(parameterIndex, value, weight = 1.0) {
        this.setParameterValueByIndex(parameterIndex, this.getParameterValueByIndex(parameterIndex) + value * weight);
    }
    /**
     * パラメータの値の加算(id)
     * @param parameterId パラメータＩＤ
     * @param value 加算する値
     * @param weight 重み
     */
    addParameterValueById(parameterId, value, weight = 1.0) {
        const index = this.getParameterIndex(parameterId);
        this.addParameterValueByIndex(index, value, weight);
    }
    /**
     * パラメータの値の乗算
     * @param parameterId パラメータのID
     * @param value 乗算する値
     * @param weight 重み
     */
    multiplyParameterValueById(parameterId, value, weight = 1.0) {
        const index = this.getParameterIndex(parameterId);
        this.multiplyParameterValueByIndex(index, value, weight);
    }
    /**
     * パラメータの値の乗算
     * @param parameterIndex パラメータのインデックス
     * @param value 乗算する値
     * @param weight 重み
     */
    multiplyParameterValueByIndex(parameterIndex, value, weight = 1.0) {
        this.setParameterValueByIndex(parameterIndex, this.getParameterValueByIndex(parameterIndex) *
            (1.0 + (value - 1.0) * weight));
    }
    /**
     * Drawableのインデックスの取得
     * @param drawableId DrawableのID
     * @return Drawableのインデックス
     */
    getDrawableIndex(drawableId) {
        const drawableCount = this._model.drawables.count;
        for (let drawableIndex = 0; drawableIndex < drawableCount; ++drawableIndex) {
            if (this._drawableIds.at(drawableIndex) == drawableId) {
                return drawableIndex;
            }
        }
        return -1;
    }
    /**
     * Drawableの個数の取得
     * @return drawableの個数
     */
    getDrawableCount() {
        const drawableCount = this._model.drawables.count;
        return drawableCount;
    }
    /**
     * DrawableのIDを取得する
     * @param drawableIndex Drawableのインデックス
     * @return drawableのID
     */
    getDrawableId(drawableIndex) {
        const parameterIds = this._model.drawables.ids;
        return CubismFramework.getIdManager().getId(parameterIds[drawableIndex]);
    }
    /**
     * Drawableの描画順リストの取得
     * @return Drawableの描画順リスト
     */
    getDrawableRenderOrders() {
        const renderOrders = this._model.drawables.renderOrders;
        return renderOrders;
    }
    /**
     * Drawableのテクスチャインデックスリストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのテクスチャインデックスリスト
     */
    getDrawableTextureIndices(drawableIndex) {
        const textureIndices = this._model.drawables.textureIndices;
        return textureIndices[drawableIndex];
    }
    /**
     * DrawableのVertexPositionsの変化情報の取得
     *
     * 直近のCubismModel.update関数でDrawableの頂点情報が変化したかを取得する。
     *
     * @param   drawableIndex   Drawableのインデックス
     * @retval  true    Drawableの頂点情報が直近のCubismModel.update関数で変化した
     * @retval  false   Drawableの頂点情報が直近のCubismModel.update関数で変化していない
     */
    getDrawableDynamicFlagVertexPositionsDidChange(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(dynamicFlags[drawableIndex]);
    }
    /**
     * Drawableの頂点インデックスの個数の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点インデックスの個数
     */
    getDrawableVertexIndexCount(drawableIndex) {
        const indexCounts = this._model.drawables.indexCounts;
        return indexCounts[drawableIndex];
    }
    /**
     * Drawableの頂点の個数の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点の個数
     */
    getDrawableVertexCount(drawableIndex) {
        const vertexCounts = this._model.drawables.vertexCounts;
        return vertexCounts[drawableIndex];
    }
    /**
     * Drawableの頂点リストの取得
     * @param drawableIndex drawableのインデックス
     * @return drawableの頂点リスト
     */
    getDrawableVertices(drawableIndex) {
        return this.getDrawableVertexPositions(drawableIndex);
    }
    /**
     * Drawableの頂点インデックスリストの取得
     * @param drarableIndex Drawableのインデックス
     * @return drawableの頂点インデックスリスト
     */
    getDrawableVertexIndices(drawableIndex) {
        const indicesArray = this._model.drawables.indices;
        return indicesArray[drawableIndex];
    }
    /**
     * Drawableの頂点リストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点リスト
     */
    getDrawableVertexPositions(drawableIndex) {
        const verticesArray = this._model.drawables.vertexPositions;
        return verticesArray[drawableIndex];
    }
    /**
     * Drawableの頂点のUVリストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点UVリスト
     */
    getDrawableVertexUvs(drawableIndex) {
        const uvsArray = this._model.drawables.vertexUvs;
        return uvsArray[drawableIndex];
    }
    /**
     * Drawableの不透明度の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの不透明度
     */
    getDrawableOpacity(drawableIndex) {
        const opacities = this._model.drawables.opacities;
        return opacities[drawableIndex];
    }
    /**
     * Drawableのカリング情報の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのカリング情報
     */
    getDrawableCulling(drawableIndex) {
        const constantFlags = this._model.drawables.constantFlags;
        return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(constantFlags[drawableIndex]);
    }
    /**
     * Drawableのブレンドモードを取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのブレンドモード
     */
    getDrawableBlendMode(drawableIndex) {
        const constantFlags = this._model.drawables.constantFlags;
        return Live2DCubismCore.Utils.hasBlendAdditiveBit(constantFlags[drawableIndex])
            ? CubismBlendMode.CubismBlendMode_Additive
            : Live2DCubismCore.Utils.hasBlendMultiplicativeBit(constantFlags[drawableIndex])
                ? CubismBlendMode.CubismBlendMode_Multiplicative
                : CubismBlendMode.CubismBlendMode_Normal;
    }
    /**
     * Drawableのマスクの反転使用の取得
     *
     * Drawableのマスク使用時の反転設定を取得する。
     * マスクを使用しない場合は無視される。
     *
     * @param drawableIndex Drawableのインデックス
     * @return Drawableの反転設定
     */
    getDrawableInvertedMaskBit(drawableIndex) {
        const constantFlags = this._model.drawables.constantFlags;
        return Live2DCubismCore.Utils.hasIsInvertedMaskBit(constantFlags[drawableIndex]);
    }
    /**
     * Drawableのクリッピングマスクリストの取得
     * @return Drawableのクリッピングマスクリスト
     */
    getDrawableMasks() {
        const masks = this._model.drawables.masks;
        return masks;
    }
    /**
     * Drawableのクリッピングマスクの個数リストの取得
     * @return Drawableのクリッピングマスクの個数リスト
     */
    getDrawableMaskCounts() {
        const maskCounts = this._model.drawables.maskCounts;
        return maskCounts;
    }
    /**
     * クリッピングマスクの使用状態
     *
     * @return true クリッピングマスクを使用している
     * @return false クリッピングマスクを使用していない
     */
    isUsingMasking() {
        for (let d = 0; d < this._model.drawables.count; ++d) {
            if (this._model.drawables.maskCounts[d] <= 0) {
                continue;
            }
            return true;
        }
        return false;
    }
    /**
     * Drawableの表示情報を取得する
     *
     * @param drawableIndex Drawableのインデックス
     * @return true Drawableが表示
     * @return false Drawableが非表示
     */
    getDrawableDynamicFlagIsVisible(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasIsVisibleBit(dynamicFlags[drawableIndex]);
    }
    /**
     * DrawableのDrawOrderの変化情報の取得
     *
     * 直近のCubismModel.update関数でdrawableのdrawOrderが変化したかを取得する。
     * drawOrderはartMesh上で指定する0から1000の情報
     * @param drawableIndex drawableのインデックス
     * @return true drawableの不透明度が直近のCubismModel.update関数で変化した
     * @return false drawableの不透明度が直近のCubismModel.update関数で変化している
     */
    getDrawableDynamicFlagVisibilityDidChange(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasVisibilityDidChangeBit(dynamicFlags[drawableIndex]);
    }
    /**
     * Drawableの不透明度の変化情報の取得
     *
     * 直近のCubismModel.update関数でdrawableの不透明度が変化したかを取得する。
     *
     * @param drawableIndex drawableのインデックス
     * @return true Drawableの不透明度が直近のCubismModel.update関数で変化した
     * @return false Drawableの不透明度が直近のCubismModel.update関数で変化してない
     */
    getDrawableDynamicFlagOpacityDidChange(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasOpacityDidChangeBit(dynamicFlags[drawableIndex]);
    }
    /**
     * Drawableの描画順序の変化情報の取得
     *
     * 直近のCubismModel.update関数でDrawableの描画の順序が変化したかを取得する。
     *
     * @param drawableIndex Drawableのインデックス
     * @return true Drawableの描画の順序が直近のCubismModel.update関数で変化した
     * @return false Drawableの描画の順序が直近のCubismModel.update関数で変化してない
     */
    getDrawableDynamicFlagRenderOrderDidChange(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(dynamicFlags[drawableIndex]);
    }
    /**
     * 保存されたパラメータの読み込み
     */
    loadParameters() {
        let parameterCount = this._model.parameters.count;
        const savedParameterCount = this._savedParameters.getSize();
        if (parameterCount > savedParameterCount) {
            parameterCount = savedParameterCount;
        }
        for (let i = 0; i < parameterCount; ++i) {
            this._parameterValues[i] = this._savedParameters.at(i);
        }
    }
    /**
     * 初期化する
     */
    initialize() {
        CSM_ASSERT(this._model);
        this._parameterValues = this._model.parameters.values;
        this._partOpacities = this._model.parts.opacities;
        this._parameterMaximumValues = this._model.parameters.maximumValues;
        this._parameterMinimumValues = this._model.parameters.minimumValues;
        {
            const parameterIds = this._model.parameters.ids;
            const parameterCount = this._model.parameters.count;
            this._parameterIds.prepareCapacity(parameterCount);
            for (let i = 0; i < parameterCount; ++i) {
                this._parameterIds.pushBack(CubismFramework.getIdManager().getId(parameterIds[i]));
            }
        }
        {
            const partIds = this._model.parts.ids;
            const partCount = this._model.parts.count;
            this._partIds.prepareCapacity(partCount);
            for (let i = 0; i < partCount; ++i) {
                this._partIds.pushBack(CubismFramework.getIdManager().getId(partIds[i]));
            }
        }
        {
            const drawableIds = this._model.drawables.ids;
            const drawableCount = this._model.drawables.count;
            this._drawableIds.prepareCapacity(drawableCount);
            for (let i = 0; i < drawableCount; ++i) {
                this._drawableIds.pushBack(CubismFramework.getIdManager().getId(drawableIds[i]));
            }
        }
    }
    /**
     * コンストラクタ
     * @param model モデル
     */
    constructor(model) {
        this._model = model;
        this._parameterValues = null;
        this._parameterMaximumValues = null;
        this._parameterMinimumValues = null;
        this._partOpacities = null;
        this._savedParameters = new csmVector();
        this._parameterIds = new csmVector();
        this._drawableIds = new csmVector();
        this._partIds = new csmVector();
        this._notExistPartId = new csmMap();
        this._notExistParameterId = new csmMap();
        this._notExistParameterValues = new csmMap();
        this._notExistPartOpacities = new csmMap();
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
        this._model.release();
        this._model = null;
    }
    _notExistPartOpacities; // 存在していないパーツの不透明度のリスト
    _notExistPartId; // 存在していないパーツIDのリスト
    _notExistParameterValues; // 存在していないパラメータの値のリスト
    _notExistParameterId; // 存在していないパラメータIDのリスト
    _savedParameters; // 保存されたパラメータ
    _model; // モデル
    _parameterValues; // パラメータの値のリスト
    _parameterMaximumValues; // パラメータの最大値のリスト
    _parameterMinimumValues; // パラメータの最小値のリスト
    _partOpacities; // パーツの不透明度のリスト
    _parameterIds;
    _partIds;
    _drawableIds;
}
// Namespace definition for compatibility.
import * as $ from './cubismmodel';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismModel = $.CubismModel;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
