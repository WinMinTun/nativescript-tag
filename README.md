# NativeScript UI plugin for Tagging
NativeScript UI plugin for tagging with rich features including autocomplete

## Platform Support

Currently only support Android. Any collaborator for iOS support is welcomed!

##Android side
![alt tag](https://bytebucket.org/win_min_tun/nativescript-tag/raw/89186c909f464c089e64df0ad79907ca6277403a/demo/screenshots/Android.png)

## Usage

The plugin is developed using nativescript plugin seed (https://github.com/NathanWalker/nativescript-plugin-seed). Pls see `demo` for full example. 
###
```XML
    <Label text="{{ message }}" class="message" textWrap="true"/>

    <Label text="Editable (Default size, Custom Color)" textWrap="true" />    
    <Tags:TagGroup id="tag1" ntag_editMode="true" value="{{ tags }}" ntag_borderColor="#2095F2" ntag_textColor="#2095F2" ntag_bgColor="#ffffff" ntag_checkedBorderColor="#2095F2" ntag_checkedBgColor="#2095F2" ntag_checkedTextColor="#ffffff" />

    <Label text="Editable (with AutoComplete)" textWrap="true" />
    <Tags:TagGroup id="tag4" value="{{ tags }}" autoCompleteTags="{{ autoCompleteTags }}" ntag_autoComplete="true" />

    <Label text="Read-only (Custom size, Default Color)" textWrap="true" />    
    <Tags:TagGroup id="tag2" ntag_tagClick="{{ onTagClick }}" value="{{ tags }}" ntag_borderStrokeWidth="0.7" ntag_textSize="15" ntag_hSpacing="9" ntag_vSpacing="5" ntag_hPadding="14" ntag_vPadding="4" />

    <Label text="Read-only (Small size, Default Color)" textWrap="true" />
    <Tags:TagGroup id="tag3" value="{{ tags }}" ntag_tagClick="tag3Click" ntag_small="true" />

    <Label text="Read-only (Large size, Default Color)" textWrap="true" />
    <Tags:TagGroup id="tag3" ntag_tagClick="{{ onTagClick }}" value="{{ tags }}" ntag_large="true" />

    <Label text="Editable (Custom input hint)" textWrap="true" />
    <Tags:TagGroup id="tag4" value="{{ tags }}" ntag_editMode="true" ntag_inputHint="New Tag" ntag_large="true" />

```

###
- How to add tag (with auto complete)?
Set `ntag_autoComplete="true"` in xml and chose a suggestion or tap the autocomplete text view.

- How to remove tag (with auto complete)?
Set `ntag_autoComplete="true"` in xml and double-tap the tag to remove.

- How to add tag (without auto complete)?
Set `ntag_editMode="true"` in xml and press 'Enter' or tap the blank area of the tag group. (A few soft keyboard not honour the key event).

- How to remove tag (without auto complete)?
Set `ntag_editMode="true"` in xml and press 'Backspace' or double-tap the tag to remove.

## Attributes

### Important attributes

- **value** - *required*

String array of tags for binding

- **autoCompleteTags** - *optional*

String array of auto complete suggestion

- **ntag_autoComplete** - *optional*

Set `true` when needs autcomplete. Default is `false`

- **ntag_editMode - (boolean)** - *optional*

Default is `false` - read only. When true, can remove and add tags by double tapping and tapping the blank area of the tag group respectively. Mutually exclusive to `ntag_tagClick` due to the native android library.

- **ntag_tagClick** - *optional*

Tag click event. Mutually exclusive to `ntag_editMode=true` due to the native android library.

- **ntag_small or ntag_large - (boolean)** - *optional*

Preset tag sizes. Mutually execlusive.

- **ntag_inputHint - (string)** - *optional*

Default is 'Add Tag'

### Color attributes

- **ntag_acTextColor - (string)** - *optional*

Default is #000000

- **ntga_acPopupBg - (string)** - *optional*

Background color for autocomplete popup. Default is #F5F8FA

- **ntag_borderColor - (string)** - *optional*

Default is #49C120

- **ntag_textColor - (string)** - *optional*

Default is #49C120

- **ntag_bgColor - (string)** - *optional*

Default is #FFFFFF

- **ntag_dashBorderColor - (string)** - *optional*

Default is #AAAAAA

- **ntag_inputHintColor - (string)** - *optional*

Default is #80000000

- **ntag_inputTextColor - (string)** - *optional*

Default is #DE000000

- **ntag_checkedBorderColor - (string)** - *optional*

Default is #49C120

- **ntag_checkedTextColor - (string)** - *optional*

Default is #FFFFFF

- **ntag_checkedMarkerColor - (string)** - *optional*

Default is #FFFFFF

- **ntag_checkedBgColor - (string)** - *optional*

Default is #49C120

- **ntag_pressedBgColor - (string)** - *optional*

Default is #EDEDED

### Size attributes

- **ntag_textSize - (number)** - *optional*

Default is 13sp

- **ntag_borderStrokeWidth - (number)** - *optional*

Default is 0.5dp

- **ntag_hSpacing - (number)** - *optional*

Default is 8dp

- **ntag_vSpacing - (number)** - *optional*

Default is 4dp

- **ntag_hPadding - (number)** - *optional*

Default is 12dp

- **ntag_vPadding - (number)** - *optional*

Default is 3dp

## Credit

Credit goes to the native android library (https://github.com/2dxgujun/AndroidTagGroup) by 2dxgujun (https://github.com/2dxgujun)

## Contributing - Support for iOS?

Currently there is no support for iOS. Any suggestion (iOS library, etc) and/or contribution is welcomed!
