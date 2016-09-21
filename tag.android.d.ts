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
    ntag_bgColor: string;
    ntag_dashBorderColor: string;
    ntag_inputHintColor: string;
    ntag_inputTextColor: string;
    ntag_checkedBorderColor: string;
    ntag_checkedTextColor: string;
    ntag_checkedMarkerColor: string;
    ntag_checkedBgColor: string;
    ntag_pressedBgColor: string;
    ntga_acPopupBg: string;
    ntag_inputHint: string;
    ntag_textSize: number;
    ntag_borderStrokeWidth: number;
    ntag_hSpacing: number;
    ntag_vSpacing: number;
    ntag_hPadding: number;
    ntag_vPadding: number;
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
