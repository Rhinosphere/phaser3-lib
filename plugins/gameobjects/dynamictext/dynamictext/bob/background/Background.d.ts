import RenderBase from '../renderbase/RenderBase';

export default class Background extends RenderBase {
    readonly type: 'background';
    scrollFactorX: 0;
    scrollFactorY: 0;

    setColor(
        color?: string | number | null,
        color2?: string | number | null,
        isHorizontalGradient?: boolean
    ): this;

    setStroke(
        color?: string | number | null,
        lineWidth?: number
    ): this;

    setCornerRadius(
        radius?: number,
        iteration?: number | null
    ): this;

}