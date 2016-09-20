/**
 * @author Win Min Tun
 * @version 1.0
 */
import * as common from "./tag.common";
import app = require("application");
import proxy = require("ui/core/proxy");
import color_1 = require('color');

declare var me;
declare var java;
declare var android; // to compile-pass "android.R.layout.simple_list_item_1"
declare var Array;

function onValuePropertyChanged(data) {
    var tagGroup: TagGroup = data.object;
    if (!tagGroup.android) {
        return;
    }
    
    // change array to java.util.List
    let tagList = java.util.Arrays.asList(data.newValue);
    tagGroup.tagGroup.setTags(tagList);
}

// common.TagGroup.valueProperty.metadata.onSetNativeValue = onValuePropertyChanged;
// register callback to natively change tags when change at TagGroup.value property occurs (e.g. binding)
(<proxy.PropertyMetadata>common.TagGroup.valueProperty.metadata).onSetNativeValue = onValuePropertyChanged;

require("utils/module-merge").merge(common, module.exports);


export class TagGroup extends common.TagGroup {


    // the tags
    value: string[];
    // autocomplete tag suggestions
    private _autoCompleteTags: Array<string>;

    private _android: any;
    private _ios: any;

    private _tagGroup: any;
    private _autoCompleteTextView: any;


    // tag edit mode [false = read-only]
    public ntag_editMode: boolean = false;

    // auto complete mode
    public ntag_autoComplete: boolean = false;

    // tag click callback (mutually exclusive to _editMode according to the android plugin)
    public ntag_tagClick;

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
    public ntag_autoCompleteTextColor: string; // default: #000000;

    // view properties (Input hint, Text Size and spacings)
    public ntag_inputHint: string; // default: Add Tag
    public ntag_textSize: number; // default: 13sp
    public ntag_borderStrokeWidth: number; // default: 0.5dp
    public ntag_horizontalSpacing: number; // default: 8dp
    public ntag_verticalSpacing: number; // default: 4dp
    public ntag_horizontalPadding: number; // default: 12dp
    public ntag_verticalPadding: number; // default: 3dp

    // preset tag sizes (mutually execulsive)
    public ntag_small: boolean;
    public ntag_large: boolean;

    constructor() {
        super();        
    }

    get android() {
        return this._android;
    }

    get tagGroup() {
        return this._tagGroup;
    }

    set autoCompleteTags(val: Array<string>) {
        this._autoCompleteTags = val;
        if (val) {
            this.autoCompleteTagsUpdate(val);
        }
    }

    get autoCompleteTags(): Array<string> {
        return this._autoCompleteTags;
    }

    // create native ui
    _createUI() {

        // for android, the library is included at platforms/android/include.gradle
        this._tagGroup = new me.gujun.android.taggroup.TagGroup(this._context);

        this.styleTags(); // style the tags

        // if edit mode or autocomplete
        if (this.ntag_editMode || this.ntag_autoComplete) {

            // the same as android plugin TagGroup constructor
            let f = this._tagGroup.getClass().getDeclaredField("isAppendMode"); //NoSuchFieldException
            f.setAccessible(true);
            f.setBoolean(this._tagGroup, true); //IllegalAccessException

            if (!this.ntag_autoComplete) { // if not auto complete

                // the root is the TagGroup when not auto complete
                this._android = this._tagGroup;
                
                var tagGroup = this._tagGroup;
                var tagGroupClickListener = new android.view.View.OnClickListener({
                    onClick: function(view) {
                        tagGroup.submitTag();
                    }
                });

                this._tagGroup.appendInputTag();
                this._tagGroup.setOnClickListener(tagGroupClickListener);

            } else { // if auto complete mode

                // the android plugin does not support auto complete, so extend it here
				
                let AutoCompleteTextView = android.widget.AutoCompleteTextView;
                let LinearLayout = android.widget.LinearLayout;
                let LayoutParams = android.widget.LinearLayout.LayoutParams;
                let context = app.android.context;

                let root = new LinearLayout(context);

                root.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
                root.setOrientation(LinearLayout.VERTICAL);

                this._autoCompleteTextView = new AutoCompleteTextView(context);
                this._autoCompleteTextView.setThreshold(1);

                // style autocomplete textview
                if (!this.ntag_autoCompleteTextColor) {
                    this._autoCompleteTextView.setTextColor(new color_1.Color('black').android);
                } else {
                    this._autoCompleteTextView.setTextColor(new color_1.Color(this.ntag_autoCompleteTextColor).android);
                }

                root.addView(this._autoCompleteTextView);
                root.addView(this._tagGroup);

                // if auto complete, the root is linear layout with AutoCompleteTextView & TagGroup
                this._android = root;
            }
            
        } else { // if read only mode

                // the root is the TagGroup when read only
                this._android = this._tagGroup;
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
        this._tagGroup.setOnTagChangeListener(tagChangeListener);


        let tagClickListener = new me.gujun.android.taggroup.TagGroup.OnTagClickListener({
            onTagClick: function(tag: string) {
                let instance = that.get();
                if(instance) {
                    instance.ntag_tagClick(tag);
                }
            }
        });
        
        // register tag click listener
        this._tagGroup.setOnTagClickListener(tagClickListener);

    }

    private autoCompleteTagsUpdate(val) {
        
        let ArrayAdapter = android.widget.ArrayAdapter;
        let arr = Array.create(java.lang.String, val.length);
        val.forEach(function (item, index) {
            arr[index] = item;
        });

        let adapter = new ArrayAdapter(this._context, android.R.layout.simple_list_item_1, arr);
        this._autoCompleteTextView.setAdapter(adapter);
    }

    // Style the tags
    private styleTags() {

        // style colors
        let AndroidColor = android.graphics.Color;

        if (this.ntag_borderColor) {
            let f = this._tagGroup.getClass().getDeclaredField("borderColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_borderColor)); //IllegalAccessException
        }

        if (this.ntag_textColor) {
            let f = this._tagGroup.getClass().getDeclaredField("textColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_textColor)); //IllegalAccessException
        }

        if (this.ntag_backgroundColor) {
            let f = this._tagGroup.getClass().getDeclaredField("backgroundColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_backgroundColor)); //IllegalAccessException
        }

        if (this.ntag_dashBorderColor) {
            let f = this._tagGroup.getClass().getDeclaredField("dashBorderColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_dashBorderColor)); //IllegalAccessException
        }

        if (this.ntag_inputHintColor) {
            let f = this._tagGroup.getClass().getDeclaredField("inputHintColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_inputHintColor)); //IllegalAccessException
        }

        if (this.ntag_inputTextColor) {
            let f = this._tagGroup.getClass().getDeclaredField("inputTextColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_inputTextColor)); //IllegalAccessException
        }

        if (this.ntag_checkedBorderColor) {
            let f = this._tagGroup.getClass().getDeclaredField("checkedBorderColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_checkedBorderColor)); //IllegalAccessException
        }

        if (this.ntag_checkedTextColor) {
            let f = this._tagGroup.getClass().getDeclaredField("checkedTextColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_checkedTextColor)); //IllegalAccessException
        }

        if (this.ntag_checkedMarkerColor) {
            let f = this._tagGroup.getClass().getDeclaredField("checkedMarkerColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_checkedMarkerColor)); //IllegalAccessException
        }

        if (this.ntag_checkedBackgroundColor) {
            let f = this._tagGroup.getClass().getDeclaredField("checkedBackgroundColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_checkedBackgroundColor)); //IllegalAccessException
        }

        if (this.ntag_pressedBackgroundColor) {
            let f = this._tagGroup.getClass().getDeclaredField("pressedBackgroundColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_pressedBackgroundColor)); //IllegalAccessException
        }

        // style preset sizes
        if ((this.ntag_small || this.ntag_large) && !(this.ntag_small && this.ntag_large)) {

            let textSize;
            let hSpacing;
            let vSpacing;
            let hPadding;
            let vPadding;

            if (this.ntag_small) {
                textSize = 10;
                hSpacing = 6;
                vSpacing = 3;
                hPadding = 8;
                vPadding = 2;
            } else if (this.ntag_large) {
                textSize = 15;
                hSpacing = 9;
                vSpacing = 5;
                hPadding = 14;
                vPadding = 4;
                let f = this._tagGroup.getClass().getDeclaredField("borderStrokeWidth");
                f.setAccessible(true);
                f.setFloat(this._tagGroup, this._tagGroup.dp2px(0.7));
            }
            let f = this._tagGroup.getClass().getDeclaredField("textSize");
            f.setAccessible(true);
            f.setFloat(this._tagGroup, this._tagGroup.sp2px(textSize));
            f = this._tagGroup.getClass().getDeclaredField("horizontalSpacing"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(hSpacing));
            f = this._tagGroup.getClass().getDeclaredField("verticalSpacing"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(vSpacing));
            f = this._tagGroup.getClass().getDeclaredField("horizontalPadding"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(hPadding));
            f = this._tagGroup.getClass().getDeclaredField("verticalPadding");
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(vPadding));
        }

        // style custom sizes
        if (this.ntag_textSize) {
            let f = this._tagGroup.getClass().getDeclaredField("textSize"); //NoSuchFieldException
            f.setAccessible(true);
            f.setFloat(this._tagGroup, this._tagGroup.sp2px(this.ntag_textSize)); //IllegalAccessException
        }

        if (this.ntag_borderStrokeWidth) {
            let f = this._tagGroup.getClass().getDeclaredField("borderStrokeWidth"); //NoSuchFieldException
            f.setAccessible(true);
            f.setFloat(this._tagGroup, this._tagGroup.dp2px(this.ntag_borderStrokeWidth)); //IllegalAccessException
        }

        if (this.ntag_horizontalSpacing) {
            let f = this._tagGroup.getClass().getDeclaredField("horizontalSpacing"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(this.ntag_horizontalSpacing)); //IllegalAccessException
        }

        if (this.ntag_verticalSpacing) {
            let f = this._tagGroup.getClass().getDeclaredField("verticalSpacing"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(this.ntag_verticalSpacing)); //IllegalAccessException
        }

        if (this.ntag_horizontalPadding) {
            let f = this._tagGroup.getClass().getDeclaredField("horizontalPadding"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(this.ntag_horizontalPadding)); //IllegalAccessException
        }

        if (this.ntag_verticalPadding) {
            let f = this._tagGroup.getClass().getDeclaredField("verticalPadding"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(this.ntag_verticalPadding)); //IllegalAccessException
        }

        // set input hint text
        if (this.ntag_inputHint) {
            let f = this._tagGroup.getClass().getDeclaredField("inputHint"); //NoSuchFieldException
            f.setAccessible(true);
            f.set(this._tagGroup, this.ntag_inputHint); //IllegalAccessException
        }
    }
}
