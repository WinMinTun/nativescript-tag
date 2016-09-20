import * as common from "./tag.common";
export declare class TagGroup extends common.TagGroup {
    value: string[];
    private _autoCompleteTags;
    private _android;
    private _ios;
    private _tagGroup;
    private _autoCompleteTextView;
    static TAG_CLICK_EVENT: string;
    ntag_editMode: boolean;
    ntag_autoComplete: boolean;
    ntag_tagClick: any;
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
    ntag_acTextColor: string;
    ntga_acPopupBg: string;
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
    tagGroup: any;
    autoCompleteTags: Array<string>;
    _createUI(): void;
    private autoCompleteTagsUpdate(val);
    private styleAutoComplete();
    private styleTags();
}
