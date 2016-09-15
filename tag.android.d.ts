import * as common from "./tag.common";
export declare class TagGroup extends common.TagGroup {
    value: string[];
    private _android;
    private _ios;
    private _editMode;
    private _tagClick;
    ntag_borderColor: string;
    ntag_textColor: string;
    ntag_backgroundColor: string;
    ntag_dashBorderColor: string;
    ntag_inputHintColor: string;
    ntag_inputTextColor: string;
    ntag_checkedBorderColor: string;
    ntag_checkedTextColor: string;
    ntag_checkedMarkerColor: string;
    ntag_checkedBackgroundColor: string;
    ntag_pressedBackgroundColor: string;
    ntag_inputHint: string;
    ntag_textSize: number;
    ntag_borderStrokeWidth: number;
    ntag_horizontalSpacing: number;
    ntag_verticalSpacing: number;
    ntag_horizontalPadding: number;
    ntag_verticalPadding: number;
    ntag_small: boolean;
    ntag_large: boolean;
    constructor();
    android: any;
    ntag_editMode: boolean;
    ntag_tagClick: any;
    _createUI(): void;
    private styleTags();
}
