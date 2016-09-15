/**
 * @author Win Min Tun
 * @version 1.0
 */
import * as common from "./tag.common";
import app = require("application");
import proxy = require("ui/core/proxy");

declare var me;
declare var java;

function onValuePropertyChanged(data) {
    var tagGroup = data.object;
    if (!tagGroup.android) {
        return;
    }
    
    // change array to java.util.List
    let tagList = java.util.Arrays.asList(data.newValue);
    tagGroup.android.setTags(tagList);
}

// common.TagGroup.valueProperty.metadata.onSetNativeValue = onValuePropertyChanged;
// register callback to natively change tags when change at TagGroup.value property occurs (e.g. binding)
(<proxy.PropertyMetadata>common.TagGroup.valueProperty.metadata).onSetNativeValue = onValuePropertyChanged;

require("utils/module-merge").merge(common, module.exports);

export class TagGroup extends common.TagGroup {


    // the tags
    value: string[];

    private _android: any;
    private _ios: any;

    // tag edit mode [false = read-only]
    private _editMode: boolean = false;

    // tag click callback (mutually exclusive to _editMode according to the android plugin)
    private _tagClick;

    // view properties (Colors)
    public ntag_borderColor: string; // default: #49C120
    public ntag_textColor: string; // default: #49C120
    public ntag_backgroundColor: string; // default: #FFFFFF
    public ntag_dashBorderColor: string; // default: #AAAAAA
    public ntag_inputHintColor: string; // default: #80000000
    public ntag_inputTextColor: string; // default: #DE000000
    public ntag_checkedBorderColor: string; // default: #49C120
    public ntag_checkedTextColor: string; // default: #FFFFFF
    public ntag_checkedMarkerColor: string; // default: #FFFFFF
    public ntag_checkedBackgroundColor: string; // default: #49C120
    public ntag_pressedBackgroundColor: string; // default: #EDEDED

    // view properties (Input hint, Text Size and spacings)
    public ntag_inputHint: string; // default: Add Tag
    public ntag_textSize: number; // default: 13sp
    public ntag_borderStrokeWidth: number; // default: 0.5dp
    public ntag_horizontalSpacing: number; // default: 8dp
    public ntag_verticalSpacing: number; // default: 4dp
    public ntag_horizontalPadding: number; // default: 12dp
    public ntag_verticalPadding: number; // default: 3dp

    constructor() {
        super();        
    }

    get android() {
        return this._android;
    }

    set ntag_editMode(val: boolean) {
      if (this._editMode !== val) {
        this._editMode = val;
        this.notifyPropertyChange('ntag_editMode', val);
      }
    }

    get ntag_editMode(): boolean {
      return this._editMode;
    }

    set ntag_tagClick(callback) {
      if (this._tagClick !== callback) {
        this._tagClick = callback;
        this.notifyPropertyChange('ntag_tagClick', callback);
      }
    }

    get ntag_tagClick() {
      return this._tagClick;
    }

    // create native ui
    _createUI() {

        // for android, the library is included at platforms/android/include.gradle
        this._android = new me.gujun.android.taggroup.TagGroup(this._context);

        this.styleTags(); // style the tags

        // if edit mode
        if (this.ntag_editMode) {
            let f = this._android.getClass().getDeclaredField("isAppendMode"); //NoSuchFieldException
            f.setAccessible(true);
            f.setBoolean(this._android, true); //IllegalAccessException
            
            var tagGroup = this._android;
            var tagGroupClickListener = new android.view.View.OnClickListener({
                onClick: function(view) {
                    tagGroup.submitTag();
                }
            });

            this._android.appendInputTag();
            this._android.setOnClickListener(tagGroupClickListener);
        }        

        var that = new WeakRef(this);
        var tagChangeListener = new me.gujun.android.taggroup.TagGroup.OnTagChangeListener({
            onAppend: function(tagGroup, newTag: string){
                var instance = that.get();
                if (instance) {
                    let newTags = new java.util.ArrayList(java.util.Arrays.asList(tagGroup.getTags()));
                    // notify TagGroup.value of the native change
                    instance._onPropertyChangedFromNative(TagGroup.valueProperty, newTags.toArray());
                }
            },

            onDelete: function(tagGroup, deletedTag: string) {
                var instance = that.get();
                if (instance) {
                    let newTags = new java.util.ArrayList(java.util.Arrays.asList(tagGroup.getTags()));
                    // notify TagGroup.value of the native change
                    instance._onPropertyChangedFromNative(TagGroup.valueProperty, newTags.toArray());
                }
            }
        });

        // register OnTagChangeListener to reflect TagGroup.value property upon UI changes
        this._android.setOnTagChangeListener(tagChangeListener);


        let tagClickListener = new me.gujun.android.taggroup.TagGroup.OnTagClickListener({
            onTagClick: function(tag: string) {
                let instance = that.get();
                if(instance) {
                    console.log(instance.ntag_tagClick);
                    instance.ntag_tagClick(tag);
                }
            }
        });
        
        // register tag click listener
        this._android.setOnTagClickListener(tagClickListener);

    }

    // Style the tags
    private styleTags() {

        let AndroidColor = android.graphics.Color;

        if (this.ntag_borderColor) {
            let f = this._android.getClass().getDeclaredField("borderColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, AndroidColor.parseColor(this.ntag_borderColor)); //IllegalAccessException
        }

        if (this.ntag_textColor) {
            let f = this._android.getClass().getDeclaredField("textColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, AndroidColor.parseColor(this.ntag_textColor)); //IllegalAccessException
        }

        if (this.ntag_backgroundColor) {
            let f = this._android.getClass().getDeclaredField("backgroundColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, AndroidColor.parseColor(this.ntag_backgroundColor)); //IllegalAccessException
        }

        if (this.ntag_dashBorderColor) {
            let f = this._android.getClass().getDeclaredField("dashBorderColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, AndroidColor.parseColor(this.ntag_dashBorderColor)); //IllegalAccessException
        }

        if (this.ntag_inputHintColor) {
            let f = this._android.getClass().getDeclaredField("inputHintColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, AndroidColor.parseColor(this.ntag_inputHintColor)); //IllegalAccessException
        }

        if (this.ntag_inputTextColor) {
            let f = this._android.getClass().getDeclaredField("inputTextColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, AndroidColor.parseColor(this.ntag_inputTextColor)); //IllegalAccessException
        }

        if (this.ntag_checkedBorderColor) {
            let f = this._android.getClass().getDeclaredField("checkedBorderColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, AndroidColor.parseColor(this.ntag_checkedBorderColor)); //IllegalAccessException
        }

        if (this.ntag_checkedTextColor) {
            let f = this._android.getClass().getDeclaredField("checkedTextColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, AndroidColor.parseColor(this.ntag_checkedTextColor)); //IllegalAccessException
        }

        if (this.ntag_checkedMarkerColor) {
            let f = this._android.getClass().getDeclaredField("checkedMarkerColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, AndroidColor.parseColor(this.ntag_checkedMarkerColor)); //IllegalAccessException
        }

        if (this.ntag_checkedBackgroundColor) {
            let f = this._android.getClass().getDeclaredField("checkedBackgroundColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, AndroidColor.parseColor(this.ntag_checkedBackgroundColor)); //IllegalAccessException
        }

        if (this.ntag_pressedBackgroundColor) {
            let f = this._android.getClass().getDeclaredField("pressedBackgroundColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, AndroidColor.parseColor(this.ntag_pressedBackgroundColor)); //IllegalAccessException
        }

        if (this.ntag_inputHint) {
            let f = this._android.getClass().getDeclaredField("inputHint"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, AndroidColor.parseColor(this.ntag_inputHint)); //IllegalAccessException
        }

        if (this.ntag_textSize) {
            let f = this._android.getClass().getDeclaredField("textSize"); //NoSuchFieldException
            f.setAccessible(true);
            f.setFloat(this._android, this.ntag_textSize); //IllegalAccessException
        }

        if (this.ntag_borderStrokeWidth) {
            let f = this._android.getClass().getDeclaredField("borderStrokeWidth"); //NoSuchFieldException
            f.setAccessible(true);
            f.setFloat(this._android, this.ntag_borderStrokeWidth); //IllegalAccessException
        }

        if (this.ntag_horizontalSpacing) {
            let f = this._android.getClass().getDeclaredField("horizontalSpacing"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, this.ntag_horizontalSpacing); //IllegalAccessException
        }

        if (this.ntag_verticalSpacing) {
            let f = this._android.getClass().getDeclaredField("verticalSpacing"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, this.ntag_verticalSpacing); //IllegalAccessException
        }

        if (this.ntag_horizontalPadding) {
            let f = this._android.getClass().getDeclaredField("horizontalPadding"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, this.ntag_horizontalPadding); //IllegalAccessException
        }

        if (this.ntag_verticalPadding) {
            let f = this._android.getClass().getDeclaredField("verticalPadding"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._android, this.ntag_verticalPadding); //IllegalAccessException
        }
    }
}
