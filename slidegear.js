/*!
 * This is SlideGear, a small standalone slider library
 *
 * version   : (See below, searching 'sVersion')
 * license   : GNU LGPL v3 or later (https://www.gnu.org/licenses/lgpl.html)
 * copyright : (c) 2019 Norbert C. Maier (http://www.trilo.de)
 * note      : The minified flavour is made with Google Closure Compiler
 */
/**
 * id        : file 20190106°0211
 * encoding  : UTF-8-with-BOM
 * note      : ⇩ ⇦ ⯆ ⯇ △ ▽ ◁ ▷ ◈ ☼ ۞
 */

// [line 20190315°0731]
// Setting strict mode as the first code line makes the whole script run in
//  strict mode. The function level strict mode directives actually superfluous.
// note : About compatibility. E.g. IE10 does not yet understand strict
//    mode. SlideGear is not yet tested with IE10.
'use strict';

/**
 * This namespace contains the SlideGear code
 *
 * @id 20190106°0221
 */
var Sldgr = Sldgr || {};

/**
 * This namespace host constants
 *
 * @note Defining real constants is not so easy in JS. This constants
 *     are defined per convention, marked by having the underline.
 * @id 20190106°0521
 */
Sldgr.Cnst = Sldgr.Cnst || {};

/**
 * @id 20190315°0541
 * @var {String}
 */
Sldgr.Cnst.info = {
   sVersion : '0.1.0'                                          // 20190315°0543
   , sTimestamp : '20190323°0951'                              // 20190315°0545
};

/**
 * This namespace contains the SlideGear functions
 *
 * @id 20190106°0223
 */
Sldgr.Func = Sldgr.Func || {};

/**
 * This is the constructor of a Slide object
 *
 * @id 20190108°0131
 * @note This object shall replace the second dimension in the .. array
 * @type {Object} (using prefix d like Ding)
 */
Sldgr.Func.dSlide = function()
{
   'use strict';

   // var 20190108°0141 the path to the image
   // This is read from the user input array
   this.sImgPath = '';

   // var 20190108°0143 modify individual showing time
   // This is read from the user input array — not yet used
   this.nDurationFactor = 1.0;

   // var  20190108°0145 the image text
   // This is read from the user input array
   this.sImgText = '';

   // var  20190108°0147 the created page element
   // This is created during the Slider initialization
   this.eSliDiv = null;

   // var  20190108°0149
   // This is calculated after the image is inserted in the slide div
   this.sSizeFactor = 1.0;

   return;
};

/**
 * This event handler calculates and sets the scaled image size
 *
 * @id 20190108°0221
 * @note See ref 20190108°0233 'js image object'
 * @note See ref 20190108°0234 'mdn on image element'
 * @note Browser tests
 *     • Android    : ?
 *     • Chrome     : ok (height1 is original image size, height 2 is adjusted)
 *     • Edge       : ok
 *     • Firefox 64 : ok (though height1 is already adjusted, not only height2)
 *     • IE 9       : ?
 *     • IE 11      : ok
 *     • Opera 11   : workaround
 *     • Safari     : ?
 * @callers Only • each image onload event
 * @param {Element} elImg The image element from where this handler is called 
 */
Sldgr.Func.imageOnloadHandler = function (elImg)
{
   // get target [seq 20190108°0222]
   var eDivSlid = elImg.parentNode;
   var iOrgNaturalHi = elImg.naturalHeight;
   var iOrgNaturalWi = elImg.naturalWidth;
   var iDbgImgHeightBefore = elImg.height;

   // // sequence retired 20190314°0411'11
   // // workaround for Opera 11 [seq 20190108°0311]
   // if (Trekta.Utils.bIs_Browser_Opera) {
   //    iOrgNaturalHi = elImg.clientHeight;
   //    iOrgNaturalWi = elImg.clientWidth;
   // }

   // calculate [seq 20190108°0223]
   var iFacWi = eDivSlid.clientWidth / iOrgNaturalWi;
   var iFacHe = eDivSlid.clientHeight / iOrgNaturalHi;
   var iFac = (iFacWi < iFacHe) ? iFacWi : iFacHe;
   var iWi = Math.floor(iOrgNaturalWi * iFac);
   var iHi = Math.floor(iOrgNaturalHi * iFac);

   // adjust [seq 20190108°0224]
   elImg.height = iHi;
   elImg.width = iWi;

   // debug [seq 20190108°0225]
   if ( Sldgr.Vars.bDbgOut_1_CalcImageSize ) {
      var s = 'img onload'
            + ' slide = ' + eDivSlid.id
             + ' clientHi = ' + elImg.clientHeight
              + ' naturalHi = ' + iOrgNaturalHi
               + ' hight_1 = ' + iDbgImgHeightBefore
                + ' hight_2 = ' + elImg.height
                 ;
      Sldgr.Func.pgOutDebug(s, 'f.1');
   }
};

/**
 * Inject CSS rules into the HTML page
 *
 * @id 20190323°0231
 * @callers Only •
 * @returns {Void} 
 */
Sldgr.Func.injectStyleRules = function ()
{
   // define the rules [seq 20190323°0111]
   var sRuls = '';

   // [rule 20190323°0113]
   sRuls += 'a.DirectNavNormal {'
           + ' background-color:Transparent;' // LightGray
//    + ' z-index:8;' // around issue 20190323°0425 [zindex]
           + ' text-decoration:none;'
           + ' border:1px solid SlateGray;'
            + ' }';

   // [rule 20190323°0114]
   sRuls += ' a.DirectNavActive {'
           + ' background-color:Tomato;' // Green Red
//    + ' z-index:8;' // around issue 20190323°0425 [zindex]
           + ' text-decoration:none;'
           + ' border:1px solid SlateGray;'
            + ' }';

   // [rule 20190323°0115]
   sRuls += ' div.SlideGearDiv {'
           + ' border:9px solid Red;'
            + ' }';

   // inject the rules [seq 20190323°0117]
   var css = document.createElement("style");
   css.type = "text/css";
   css.innerHTML = sRuls;
   document.head.appendChild(css); // Opera 10 throws exception, Opera 360 works fine [note 20190314°0151]
};

/*
 * This function constitutes the constructor for one slideshow object
 *
 * @id 20190106°0251
 * @todo If possible, do not want the ID given as parameter, but generate
 *        it here in the constructor and return it to the caller. This had
 *        the advantage, that the Slider itself has the control, and can
 *        care that the ID is a valid Slider array index. [todo 20190108°0121]
 * @callers Only • startup
 * @param {integer} iSliderId — Slider ID
 */
Sldgr.Func.o1Slideshow = function( iSliderId )
{
   'use strict';

   // var 20190106°1231 syntax helper
   var oSelf = this;

   /**
    * This object stores helper properties for a slider object.
    *  This are constant in so far, as they are calculated per slider
    *  on program start and do not change during runtime any more
    *
    * @note : Remember ref 20190107°0107 'javascript namespace aliases'
    * @id 20190106°1811
    * @type {Object}
    */
    const oCs = {

      // three indices for each button [seq 20190106°1741]
      // todo : Define this with an Enum (compare 20190106°1151 Sldgr.Cnst.CmdMove)
      iBtAr_Ids : 2                                                    // [prop 20190106°1742]
      , iBtAr_Off : 1                                                  //  [prop 20190106°1743]
      , iBtAr_On : 0                                                   // [prop 20190106°1744]

      // indices for the five tools buttons [seq 20190106°1751]
      // todo : Define this with an Enum (compare 20190106°1151 Sldgr.Cnst.CmdMove)
      , iBtn_AutoLeft : 2                                              // [prop 20190106°1752]
      , iBtn_AutoRight : 1                                             // [prop 20190106°1753]
      , iBtn_SingleBack : 0                                            // [prop 20190106°1754]
      , iBtn_SingleForw : 3                                            // [prop 20190106°1755]
      , iBtn_ToggleInfo : 4                                            // [prop 20190106°1756]

      , iTmpDist : 1                                                   // [var 20190323°0531]

      , sIdImg_Unfolder1_ForCaptionBox : 'ImgSrc_Unfolder_ForCaptionBox_' + iSliderId // prop 20190314°0121
      , sIdImg_Unfolder2_ForNaviBox : 'ImgSrc_Unfolder_ForNaviBox_' + iSliderId // prop 20190314°01222
      , sIdImg_Unfolder3_ForToolsBox : 'ImgSrc_Unfolder_ForToolsBox_' + iSliderId // prop 20190314°0123
      , sIdImg_Unfolder4_ForDebugBox : 'ImgSrc_Unfolder_ForDebugBox_' + iSliderId // prop 20190314°0124

      , sId_Href_Unfold_1_CaptionBox : ( 'HrefUnfoldCaptionBox_' + iSliderId ) // prop 20190323°0343 currently unused
      , sId_Href_Unfold_2_NaviBox : ( 'HrefUnfoldNaviBox_' + iSliderId ) // prop 20190323°0533
      , sId_Href_Unfold_3_ButtonsBox : ( 'HrefUnfoldButtonsBox_' + iSliderId ) // prop 20190323°0534
      , sId_Href_Unfold_4_DebugBox : ( 'HrefUnfoldDebugBox_' + iSliderId ) // prop 20190323°0535

      , sId_Caption_Text : ( 'CaptionText_' + iSliderId )              // prop 20190323°0423

      , sId_Div_Stock : ( "StockDiv_" + iSliderId + "_" )              // prop 20190106°1717

      , sId_Panel2_Caption : ( 'CaptionPanel_' + iSliderId )           // prop 20190106°1731
      , sId_Panel3_Navigation : ( 'NavigationPanel_' + iSliderId )     // prop 20190323°0356
      , sId_Panel4_Tools : ( 'ToolPanel_' + iSliderId )                // prop 20190323°0413
      , sId_Panel5_Debug : ( 'DebugPanel_' + iSliderId + '_' )         // prop 20190106°1733

      // bulk helper properties
      , sId_Span_DbgFadeDuration : ( 'DbgFadeDuration_' + iSliderId + '_' ) // prop 20190108°0451
      , sId_Span_DbgFadeState : ( 'DbgFadeState_' + iSliderId + '_' )  // prop 20190106°1735
      , sId_Span_DbgImgFadeOut : ( 'DbgToFadeOut_' + iSliderId + '_' ) // prop 20190106°1727
      , sId_Span_DbgImgShowNow : ( 'DbgToShowNow_' + iSliderId + '_' ) // prop 20190106°1729
      , sId_Span_DbgMoveMode : ( 'DbgMoveMode_' + iSliderId + '_' )    // prop 20190108°0435
      , sId_Span_DbgProjCount : ( 'DbgProjCount_' + iSliderId + '_' )  // prop 20190108°0323
      , sId_Span_DbgSlideDuration : ( 'DbgSlideDuration_' + iSliderId + '_' ) // prop 20190108°0441
      , sId_Span_DbgSlideEleCell : ( 'DbgSlideEleCell_' + iSliderId + '_' ) // prop 20190323°0151

      , sId_Src_Image : ( 'ImgSrc_' + iSliderId + '_' )                // prop 20190107°0313
   };

   // var 20190106°1821 user settings
   var oSt = {

      // property 20190314°063x image list read from HTML attribute 'data-slidegear'
      aImgListFromAttrib : Array()

      // property 20190106°1241 user setting
      , bAutostart : Sldgr.Cnst.bDefault_Autostart

      // property 20190323°0341 user setting
      , bIsVisible01CaptionBox : false // false true

      // property 20190323°0443 user setting
      , bIsVisible02NaviBox : false // true

      // property 20190323°0441 user setting
      , bIsVisible03ToolsBox : false // true

      // property 20190106°1251 user setting
      , bIsVisible04DebugBox : false // Sldgr.Cnst.bDefault_InfoPanelVisible

      // property 20190323°0545 user setting
      , bIsVisibleDebugBorders : false // false true

      // property 20190106°1843 user setting
      // todo : Not used yet, use it.
      , bRandomOrder : Sldgr.Cnst.bDefault_RandomOrder

      // property 20190106°1845 user setting
      // todo : Not used yet, use it.
      , bRandomStart : Sldgr.Cnst.bDefault_RandomStart

      // property 20190314°0521
      // note : Not sure yet what exactly to do with those buttons
      , bShow_PanelClosing_CrossButs : false

      // prop 20190106°1321 user setting
      , iControlSetNum : Sldgr.Cnst.iDefault_ControlSet

      // prop 20190106°1311 user setting
      , iFadingDuration : Sldgr.Cnst.nDefault_FadingDuration

      // prop 20190106°1331 user setting
      , iFadingSteps : Sldgr.Cnst.iDefault_FadingSteps

      // prop 20190106°1341 the time to show one slide in milliseconds
      // note : This is not really an integer, but we would rather prefer
      , iShowingDuration : Sldgr.Cnst.nDefault_ShowingDuration * 1000

      // prop 20190106°1711 user setting
      , sBgColorImage : 'Transparent'

      // prop 20190107°0631 user setting
      , sBgColorSlider : null

      // prop 20190209°0911 user setting
      , sReadFromJson : ''
   };

   // working vars [var 20190106°1831]
   var oVr = {

      // the button set [line 20190106°1725]
      aCtrBtns : new Array()

      /**
       * This object controls the beamers activity
       *
       * @id 20190108°0111
       * @type {Object}
       */
       , Stage : {

         // prop 20190106°1847 fading counter
         iFadeCount : 0

         // prop 20190106°1847 fading algorithm — not yet used
         , iFadingAlgo : Sldgr.Cnst.CmdFade.Soft // Soft Hard

         // prop 20190106°1851 index for current image in the stockpile array
         , iNdxCurr : 0 // -1

         // prop 20190108°0434 the current movement mode
         , iMode : Sldgr.Cnst.Mode.Single

         // prop 20190106°1853 index for previous image in the stockpile array
         , iNdxPrev : -1
      }

      /**
       * The magazine is an array of slides, it will be filled from the user input array
       *
       * @id 20190106°1451
       * @note Also called stockpile ringbuffer array [prop 20190106°1715]
       * @summary : This is a multidimensional array consisting of the following
       * @type {Array}
       */
      , aMag : new Array()

      // prop 20190106°1721 slider panel height
      // note : Remember the difference
      //    • el.style.height yields string "123px"
      //    • el.clientHeight yields a number 123.0 but is read-only
      , iSliderPanelHeight : Sldgr.Vars.arDivSliders[iSliderId].clientHeight

      // prop 20190106°1723 image panel height
      , iSliderPanelWidth : Sldgr.Vars.arDivSliders[iSliderId].clientWidth

      // prop 20190106°1411 this controls fading
      // note : Acutally one timer were sufficient for the two tasks,
      //    just for sake of easiser code reading, we use two different.
      // note : See ref 20190108°0352 'on timers'
      , timerFade : null

      // prop 20190106°1412 this controls sliding
      , timerSlide : null
   };

   // [prop 20190108°0213]
   this.iStartImageNdx = Sldgr.Cnst.iDefault_StartImgNo - 1; // 1 - 1 = 0

   // Counts projector calls for debug purposes [prop 20190108°0321]
   this.iDebugProjectCounter = 0;

   /**
    * This method brackets the constructor instructions
    *
    * @id 20190106°1911
    * @ callers Only • o1Slideshow
    */
   this.o1Slideshow_Code = function()
   {
      'use strict';

      // provide the primordial button set [seq 20190106°1855]
      // note : Note the difference between cloning the array with slice vs. assigning it.
      oVr.aCtrBtns = Sldgr.Cnst.aControls_Shiny.slice(0); // zero means 'clone complete'

      // generate multidim array with button IDs and image URLs [seq 20190106°1745]
      var ar = new Array(5);
      for (var i = 0; i < oVr.aCtrBtns[0].length; i++) {
         ar[i] = 'Button_' + iSliderId + '_' + i;
      }
      oVr.aCtrBtns.push(ar);                                           // the IDs array

      Sldgr.Vars.bButtonPathesCompleted_OBSOLETE = true;

      // achieve random order [seq 20190106°1921]
      // todo : Test and fix
      if ( oSt.bRandomOrder ) {
         var iRand = Math.floor( Math.random() * oVr.aMag.length ) ;
         for (var i = 0; i <= (iRand * oVr.aMag.length) ; i++ ) {
            aMag.push(oVr.aMag.shift());
         }
      }

      // do random start [seq 20190106°1923]
      if ( oSt.bRandomStart ) {
         var iRand = Math.floor( Math.random() * oVr.aMag.length ) ;
         oVr.Stage.iNdxCurr = iRand;
      }

      // debug print all image pathes [debug 20190106°2014]
      if ( Sldgr.Vars.bDbgOut_2_slider_constructor ) {
         var s = 'Hello ' + iSliderId + ' x=' + oVr.iSliderPanelWidth + ' y=' + oVr.iSliderPanelHeight;
         Sldgr.Func.pgOutDebug(s, 'f.2', iSliderId);
      }
   };

   /**
    * This method shall populate the record array for this slider
    *
    * @id 20190106°0611
    * @callers Only • startup
    */
   this.o2ReadSetup = function()
   {
      'use strict';

      // retrieve setup command [seq 20190107°0611]
      var oProps = {};
      var e = Sldgr.Vars.arDivSliders[iSliderId];
      var sCmd = e.getAttribute(Sldgr.Cnst.sPlate_DataSlidegearAttrib); // 'data-slidegear'

      // primitive parser [seq 20190107°0613]
      if (sCmd) {
         var arEqus = sCmd.split(';');
         for (var i = 0; i < arEqus.length; i++) {
            if (arEqus[i].length > 1) {
               var arToks = arEqus[i].split('=');
               if (arToks.length > 1) {
                  arToks[0] = arToks[0].trim();
                  arToks[1] = arToks[1].trim();
                  oProps[arToks[0]] = arToks[1];
               }
            }
         }
      }
      // now we have the settings as key/value pairs in oProps

      // read all keys [seq 20190107°0615]
      //  Modern flavour, no more feature switch since 20190314°0411
      Object.keys(oProps).forEach(function(sKey) {
         oSelf.o2ReadSetup_EvalKeys(sKey, oProps[sKey]);
      });

      // job outsourced
      oSelf.o2ReadSetup_ImageList();

      // overwrite page HTML style [seq 20190107°0643]
      if (oSt.sBgColorSlider !== null) {
         Sldgr.Vars.arDivSliders[iSliderId].style.backgroundColor = oSt.sBgColorSlider;
      }
   };

   /**
    * This method reads the commands from data-setup attribute of the HTML slider div element
    *
    * @id 20190107°0831
    * @caller •
    * @param {String} sKey The key token
    * @param {String} sVal The value to set
    */
   this.o2ReadSetup_EvalKeys = function(sKey, sVal)
   {
      'use strict';

      // debug [seq 20190107°0832]
      if ( Sldgr.Vars.bDbgOut_3_read_setup ) {
         var s = 'process setting ' + sKey + ' = ' + sVal;
         Sldgr.Func.pgOutDebug(s, 'f.3', iSliderId);
      }

      // workaround [seq 20190314°0651]
      //  quick'n'dirty to be able to read the same key multiple times
      if ( sKey.indexOf('image') === 0 ) {
         sKey = 'image';
      }

      // do job [seq 20190107°0833]
      switch (sKey) {
         case 'autostart' :
            oSt.bAutostart = (sVal === 'yes') ? true : false;
            break;
         case 'background-color-image' :
            oSt.sBgColorImage = sVal;
            break;

         case 'image' :

            // () prologue
            var aToks = sVal.split(' ');

            // (.1) read token one, the path
            var sImg = aToks.shift();

            // (.2) read not-yet-used dummy field
            var sDum = '';
            while (sDum === '') {
               sDum = aToks.shift();
            }

            // (.3) read caption
            // issue 20190314°0641 : If the value did contain an equal sign (=),
            //  the sign plus the text behind it will be lost. E.g. "Logo <a href".
            var sCap = '';
            while (aToks.length > 0) {
               if (sCap !== '') { sCap += ' '; }
               sCap += aToks.shift();
            }

            // () save result for being processed later
            oSt.aImgListFromAttrib.push(sImg);
            oSt.aImgListFromAttrib.push(sDum);
            oSt.aImgListFromAttrib.push(sCap);

            break;

         case 'background-color-slider' :
            oSt.sBgColorSlider = sVal;
            break;
         case 'move-direction' :
            switch (sVal) {
               case 'left' : oVr.Stage.iMode = Sldgr.Cnst.Mode.Left; break;
               default : oVr.Stage.iMode = Sldgr.Cnst.Mode.Right; break;
            }
            break;
         case 'read-from-json' :
            oSt.sReadFromJson = sVal;
            break;

         case 'show-panel-2-caption' :
         case 'show-caption-panel' :
            oSt.bIsVisible01CaptionBox = (sVal === 'yes') ? true : false;
            break;
         case 'show-panel-3-navi' :
         case 'show-navigation-panel' :
            oSt.bIsVisible02NaviBox = (sVal === 'yes') ? true : false;
            break;
         case 'show-panel-4-tools' :
            oSt.bIsVisible03ToolsBox = (sVal === 'yes') ? true : false;
            break;
         case 'show-debug-panel' :
            oSt.bIsVisible04DebugBox = (sVal === 'yes') ? true : false;
            break;
         case 'show-duration' :
            oSt.iShowingDuration = Number(sVal) * 1000;
            break;
         case 'start-image-number' :
            oSelf.iStartImageNdx = Number(sVal) - 1;
            break;
         default :
            break;
      }

      // quick workaround to enforce valid unfolder order [seq 20190314°0541]
      // note : Compare seq 20190314°0545
      if (oSt.bIsVisible04DebugBox === true ) { oSt.bIsVisible03ToolsBox = true; }
      if (oSt.bIsVisible03ToolsBox === true ) { oSt.bIsVisible02NaviBox = true; }
      if (oSt.bIsVisible02NaviBox === true ) { oSt.bIsVisible01CaptionBox = true; }
   };

   /**
    * This method shall populate the record array for this slider from
    *  • either JSON file • or HTML attribute • or built-in fallback list
    *
    * @id 20190106°0615
    * @callers Only • o2ReadSetup
    */
   this.o2ReadSetup_ImageList = function()
   {
      'use strict';

      // pessimistic predetermination
      var bUseFallback = false;
      var bWorkaroundDidReadFromAttrib = false;

      // image list was already read from HTML attribute [seq 20190314°0631]
      if ( typeof oSt.aImgListFromAttrib !== 'undefined' ) {
         if ( oSt.aImgListFromAttrib !== null ) {
            if ( oSt.aImgListFromAttrib.length > 0  ) {

               // list was read from HTML attribute 'data-slidegear'

               // debug
               var s = "Image list from attribute, image number*3 = " + oSt.aImgListFromAttrib.length;
               Sldgr.Func.pgOutDebug(s, 'f.x1', iSliderId);

               for (var i = 0; i < oSt.aImgListFromAttrib.length; i += 3) {
                  var s = " — " + oSt.aImgListFromAttrib[i]
                         +  " : " + oSt.aImgListFromAttrib[i + 2]
                          ;
                  Sldgr.Func.pgOutDebug(s, 'f.x2', iSliderId);
               }

               // provide list as below known variable
               Sldgr.Vars.arImgImport = oSt.aImgListFromAttrib;
               bWorkaroundDidReadFromAttrib = true;
            }
         }
      }

      // read image list from JSON file [seq 20190106°1441]
      if ( oSt.sReadFromJson !== '' )
      {
         var sFnam = oSt.sReadFromJson;
         var sRead = Trekta.Utils.readTextFile1(sFnam);
         Sldgr.Vars.arImgImport = null;
         try {
            var data = JSON.parse(sRead);
            Sldgr.Vars.arImgImport = data.slideshow;
         } catch (e) {
            bUseFallback = true;
         }
      }
      
      // use built-in fallback
      else {
         if (! bWorkaroundDidReadFromAttrib ) {
            bUseFallback = true;
         }
      }

      // load built-in fallback images
      if ( bUseFallback ) {
         Sldgr.Vars.arImgImport = Sldgr.Cnst.aFallbackShow_One;

         // shutdown 20190315°0531 now we have base64 embedded images
         // // // adjust pathes for the built-in fallback images [seq 20190210°0215]
         // // for (var i = 0; i < Sldgr.Vars.arImgImport.length; i = i + 3)
         // // {
         // //    Sldgr.Vars.arImgImport[i] = Sldgr.Cnst.s_ThisScriptFolderRel // Trekta.Utils.scriptPathInfo('/slidegear.js')[0];
         // //                               + Sldgr.Vars.arImgImport[i]
         // //                                ;
         // // }
      }
      // () create and fill the Magazine from the flat user input array [seq 20190106°1521]
      oVr.aMag = new Array();
      // note : Here the Magazine array is built and filled, except for fields
      //    slid.eSliDiv and slid.sSizeFactor, which can be filled only later.
      for (var i = 0; i < ( Sldgr.Vars.arImgImport.length / Sldgr.Cnst.iRecordWidth_Input ); i++) {
         var iNdxImpo = i * Sldgr.Cnst.iRecordWidth_Input;
         var slid = new Sldgr.Func.dSlide();
         slid.sImgPath = Sldgr.Vars.arImgImport[iNdxImpo + Sldgr.Cnst.iStkFld_Path];
         slid.nDurationFactor = Sldgr.Vars.arImgImport[iNdxImpo + Sldgr.Cnst.iStkFld_Factor];
         slid.sImgText = Sldgr.Vars.arImgImport[iNdxImpo + Sldgr.Cnst.iStkFld_Text];
         oVr.aMag.push(slid);
      }
   };

   /**
    * This method builds the slider HTML block
    *
    * @id 20190106°0621
    * @callers Only • startup
    */
   this.o3Build0Html = function()
   {
      'use strict';

      // build top level div fragmen [seq 20190106°1551]
      //  • It stretches down with all other panels (by display:table)
      // See note 20190107°0351 'css display-table'
      var sDiv = '<div style="'
                + ' border:0px dotted Tomato;' // [DbgBrdr 1]
                 + ' display:table;'
                  + '" id="Sg_SliderPanelOuterDiv_' + iSliderId +  '"'
                   + '>'
                    ;

      // add top image box [seq 20190106°1552]
      //  • Has fixed size after the HTML pages hardcoded div values
      //  • Contains the unfolder button with position absolute right below
      var sFrg = oSelf.o3Build1ImgPanel();
      sDiv += sFrg;

      // add caption box [seq 20190323°0411]
      var sFrg = oSelf.o3Build2CaptionPanel();
      sDiv += sFrg;

      // add navigation box [seq 20190323°0413]
      var sFrg = oSelf.o3Build3NaviPanel();
      sDiv += sFrg;

      // add buttons box [seq 20190106°1553]
      sFrg = oSelf.o3Build4ToolsPanel();
      sDiv += sFrg;

      // add debug box [seq 20190106°1554] this is a table
      sFrg = oSelf.o3Build50DebugPanel();
      sDiv += sFrg;

      // close the HTML fragment [seq 20190106°1555]
      sDiv += '</div>';

      // attach the built HTML fragment to the target location [seq 20190106°1541]
      Sldgr.Vars.arDivSliders[iSliderId].innerHTML = sDiv;

      // fill stockpile array from recently created image div elements [seq 20190106°1545]
      for ( var i = 0; i < oVr.aMag.length; i++ )
      {
         var eDiv = document.getElementById(oCs.sId_Div_Stock + i);
         oVr.aMag[i].eSliDiv = eDiv;
      }
   };

   /**
    * This method builds the image sequence HTML fragment
    *
    * @id 20190106°0631
    * @returns {String} The wanted div HTML fragment
    */
   this.o3Build1ImgPanel = function()
   {
      'use strict';

      var sDiv = '';

      // [seq 20190106°1556]
      sDiv += '<div'
            + ' style="'
            + ' position:relative;'
            + ' width:' + oVr.iSliderPanelWidth + 'px;'
            + ' height:' + oVr.iSliderPanelHeight + 'px;'
            + ' border:0px dashed LimeGreen;'                          // [DbgBrdr 2]
            + '" id="Sg_ImageSequence_' + iSliderId + '"'
             + '>'
              ;

      // iterate the images in the magazine [seq 20190106°1611]
      for ( var iImg = 0; iImg < oVr.aMag.length; iImg++ ) {

         // prologue [seq 20190106°1613]
         //

         // center [seq 20190106°1621]
         // note : See issue 20190107°0433 'center image vertically'
         // note : See ref 20190107°0753 'detect flexbox support'
         // see : ref 20190107°0435 'bert bos : centering things'
         var sCenter = 'display:flex; align-items:center; justify-content:center;';

         // build one image div [seq 20190106°1622]
         sDiv += '<div id="' + oCs.sId_Div_Stock + (iImg) + '"'
               + ' style="font-size:0; margin:0; padding:0;'
               + ' ' + sCenter
               + ' height:' + oVr.iSliderPanelHeight + 'px;'
               + ' visibility:hidden;'
               + ' z-index:1;'                                         // [zindex]~
               + ' position:absolute; left:0; top:0;'
               + ' width:' + oVr.iSliderPanelWidth + 'px;'
               + ' background-color:' + oSt.sBgColorImage + ';">'
                ;

         // [seq 20190106°1623]
         sDiv += '<img src="' + oVr.aMag[iImg].sImgPath + '"'
               + ' style="border:0;"'
                + ' alt="Sldr ' + (iSliderId + 1) + ' image ' + (iImg + 1) + '"'
                 + ' id="' + oCs.sId_Src_Image + iImg + '"'
                  + ' onload="' + 'Sldgr.Func.imageOnloadHandler(this);' + '"'
                   + ' />'
                    ;

         // [debug 20190106°2015]
         if ( Sldgr.Vars.bDbgOut_4_build_img_seq ) {
            var s = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; — '
                   + oVr.aMag[iImg].sImgPath
                    ;
            Sldgr.Func.pgOutDebug(s, 'f.4', iSliderId);
         }

         sDiv += '</div>'; //
      }

      //-----------------------
      // primary unfolder control [seq 20190323°0251]
      // note : Remember ref 20190323°0313 'css-tricks: absolute positioning'
      // note : Remember note 20190314°0131 'using unicode buttons'
      var sFrg = '<div style="'
                + ' display:table;'
                + ' position:absolute; bottom:-29px; right:-5px;'      // [unfolderbutton-position]
               + ' z-index:99;'                                        // [zindex] ✱
                + '" id="Sg_PrimaryUnfoldControl' + iSliderId + '">'
                + '<a href='
                + '"javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickUnfolderBtns(\'primary_button\');"'
                + ' style="'
                + ' border:0px dotted Gray;'                           // -- [DbgBrdr 3]
                + ' color:Gray;'
                + ' font-size:177%;'
                + ' font-weight:bold;'
                + ' text-decoration:none;'
                + ' z-index:67;' // [zindex]
                + '"'
                + ' id="' + oCs.sId_Href_Unfold_1_CaptionBox + '"'
                + ' title="Open/close Title Box"'
                + '>'
                + '<img src="'
                + ( oSt.bIsVisible01CaptionBox
                   ? Sldgr.Cnst.sData_Btn_Left_SlateGray
                    : Sldgr.Cnst.sData_Btn_Down_SlateGray
                     )
                + '" width="18" height="18"'
                + ' alt="Open/Close Caption Panel"'
                + ' title="Open/Close Caption Panel"'
                + ' id="' + oCs.sIdImg_Unfolder1_ForCaptionBox + '"'
                + ' />'
                + '</a>'
                 + '</div>'
                  ;
      sDiv += sFrg;
      //-----------------------

      // close this div [line 20190323°0253]
      sDiv += '</div>';

      return sDiv;
   };

   /**
    * This method builds the caption div HTML fragment
    *
    * @id 20190106°0641
    * @note  Remember important note 20190106°1637 'about style display'
    * @returns {String} The wanted div HTML fragment
    */
   this.o3Build2CaptionPanel = function()
   {
      'use strict';

      // open div [seq 20190106°1631]
      var sHt = '';
      sHt += '<div'
            + ' id="' + oCs.sId_Panel2_Caption + '"'
            + ' style="'
            + ' background-color:Transparent;'                         // Transparent White
            + ' border:0px solid LightGreen;'                          // [DbgBrdr 4]
            + ' display:' + (oSt.bIsVisible01CaptionBox ? 'block' : 'none') + ';'
            + ' height:' + '1.3' + 'em;'
            + ' margin-top:0.3em;'                                     // [vertical-panel-spacing]
            + ' padding-right:0.7em;'
            + ' position:relative;' // so the unfolder button can be absolute
            + ' text-align:left;'
            + ' width:' + (oVr.iSliderPanelWidth - 8) + 'px;'          // minus 16 21 47
            + ' z-index:4;'                                            // -1 [zindex] ✱
             + '">'
              ;

      // place to be filled programmatically [seq 20190106°1633]
      sHt += '<span'
           + ' id="' + oCs.sId_Caption_Text + '"'
            + ' style="'
             + 'background-color:Transparent;'                         // Transparent White
             + 'border:0px dotted RoyalBlue;'                          // [DbgBrdr 5]
             + 'color:DarkSlateGray;'
             + 'display:inline-block;' //
             + 'overflow:hidden;'      // Is this sensible? Yes, with display:inline-block and height:100%
             + 'height:100%;'          //
             + 'width:99%;'            //
             + '">'
              + '"</span>'
               ;

      // caption box unfolder button [seq 20190323°0421]
      var sDv = '<div';
      sDv += ' id="CaptionBox_UnfolderButton_Div_' + iSliderId + '"'
           + ' style="'
           + ' position:absolute; bottom:-29px; right:-2px;'           // [unfolderbutton-position]
          + ' z-index:2;'                                              // [zindex] !
           + '">'
           + '<a href='
           + '"javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickUnfolderBtns(\'captionbox_button\');"'
           + ' style="'
           + ' border:0px dotted Gray;'                                // [DbgBrdr 6]
           + ' text-decoration:none;'
           + '" id="' + oCs.sId_Href_Unfold_2_NaviBox + '"'
           + ' title="Open/close Navigation Bar"'
           + '>'
           + '<img src="'
           + ( oSt.bIsVisible02NaviBox
              ? Sldgr.Cnst.sData_Btn_Left_SteelBlue
               : Sldgr.Cnst.sData_Btn_Down_SteelBlue
                )
           + '" width="18" height="18"'
           + ' alt="Open/Close Navigation Panel"'
           + ' title="Open/Close Navigation Panel"'
           + ' id="' + oCs.sIdImg_Unfolder2_ForNaviBox + '"'
           + ' />'
           + '</a>'
           + '</div>'
            ;
      sHt += sDv;

      // caption box close button [seq 20190314°0421]
      var sDv = '<div';
      sDv += 'id="CaptionBox_CloseButton_Div_' + iSliderId + '"'
           + ' style="'
           + ' position:absolute; top:3px; right:-26px;'               // [closebutton-position]
          + ' z-index:1;'                                              // [zindex]
           + '">'
           + '<a href='
           + '"javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickUnfolderBtns(\'primary_button\');"'
           + ' style="'
           + ' text-decoration:none;'
           + '" id="CaptionBox_CloseButton_Href"'
           + ' title="Open/close Caption Panel"'
           + '>'
           + '<img src="'
           + Sldgr.Cnst.sData_Btn_Cross_SlateGray
           + '" width="18px" height="18px"'
           + ' alt="Open/Close Caption Panel"'
           + ' title="Open/Close Caption Panel"'
           + ' id="CaptionBox_ImgSrc"'
           + ' />'
           + '</a>'
           + '</div>'
            ;
      if ( Sldgr.Cnst.bShow_GrowPanels_CloseButtons ) {
         sHt += sDv;
      }

      // close div [seq 20190106°1635]
      sHt += '</div>';

      return sHt;
   };

   /**
    * This method builds the navigation HTML div fragment
    *
    * @id 20190323°0351
    * @returns {String} The wanted div HTML fragment
    */
   this.o3Build3NaviPanel = function()
   {
      'use strict';

      // [line 20190314°0621]
      var iSome_Offset_12 = 12;
      var iNaviPanelWidth = (oVr.iSliderPanelWidth - iSome_Offset_12); // 14 is some offset, which must be overflown to the unfolder button

      // build div [seq 20190323°0353]
      var sHt = '<div'
           + ' id="' + oCs.sId_Panel3_Navigation + '"'
           + ' style="'
           + ' background-color:Transparent;'                          // Transparent White
           + ' border:0px solid Chocolate;'                            // [DbgBrdr 7]
           +  'display:' + (oSt.bIsVisible02NaviBox ? 'table' : 'none')  + ';'
           + ' margin-top:0.3em;'                                      // [vertical-panel-spacing]
           + ' position:relative;'
           + ' width:' + iNaviPanelWidth + 'px;'
          + ' z-index:3;'                                              // 1 [zindex] ✱ (see issue 20190323°0425)
            + '">'
             ;

      // prepend button auto-backward [seq 20190314°0551]
      var sFrg = '<a'
                + ' style="'
                + ' border:1px solid SlateGray;'
                + ' border-radius:33%;'
                + ' font-weight:bold;'
                + ' padding-left:0.1em; padding-right:0.3em;'
                + ' text-decoration:none;'
                + '"'
             // + ' class="DirectNavNormal"'
                + ' href="'
                + 'javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickAutoGoLeft();'
                + '" title="Auto Slide Backward"'
                + ' id="NaviPanelButton_AutoBackward_' + iSliderId + '"'
                + '>◁</a>&nbsp;'
                 ;
      sHt += sFrg;

      // build the single images direct links [seq 20190106°1653]
      var sFrg = '';
      for ( var iNum = 1; iNum <= oVr.aMag.length; iNum++ ) {
         sFrg += '<a href="' + 'javascript:Sldgr.Vars.arObSliders['
               + iSliderId + '].oClickGoSelected(' + iNum + ');"'
                + ' style="'
                + ' border:1px solid SlateGray;'
                + ' border-radius:33%;'
                + ' font-size:small;'
                + ' line-height:1.5em;'
                + ' text-decoration:none;'
                + '"'
                + ' class="DirectNavNormal"'
                + ' title="' + 'Goto Image No ' + iNum + '"'
                + ' id="DirectNav_' + iSliderId + '_' + iNum + '"'     // [line 20190323°0123]
                + '>&nbsp;' + iNum + '&nbsp;'
                + '</a>&#8203;'                                        // zero-width space
                 + ' '                                                 // optional
                  ;
      }
      sHt += sFrg;

      // append button auto-foward [seq 20190314°0551]
      var sFrg = '<a'
                + ' style="'
                + ' border:1px solid SlateGray;'
                + ' border-radius:33%;'
                + ' font-weight:bold;'
                + ' padding-left:0.3em; padding-right:0.1em;'
                + ' text-decoration:none;'
                + '"'
                + ' href="javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickAutoGoRight();"'
                + ' title="Auto Slide Forward"'
                + ' id="NaviPanelButton_AutoForward_' + iSliderId + '"'
                + '>▷</a>&nbsp;'
                 ;
      sHt += sFrg;

      // navibox unfolder button [seq 20190323°0423]
      var iPositionRight = -5 - iSome_Offset_12;
      var sDv = '<div';
      sDv += ' id="Div_UnfolderForNaviBox_' + iSliderId + '"'
           + ' style="'
           + ' border:0px dotted Gray;' // [DbgBrdr 8]
           + ' position:absolute; bottom:-29px; right:' + iPositionRight + 'px;' // [unfolderbutton-position]
           + '">'
           + '<a href='
           + '"javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickUnfolderBtns(\'navibox_button\');"'
           + ' style="'
           + ' text-decoration:none;'
           + '"'
           + ' id="' + oCs.sId_Href_Unfold_3_ButtonsBox + '"'
           + ' title="Open/Close Tools Panel"'
           + '>'
           + '<img src="'
           + ( oSt.bIsVisible03ToolsBox
              ? Sldgr.Cnst.sData_Btn_Left_DarkSeaGreen
               : Sldgr.Cnst.sData_Btn_Down_DarkSeaGreen
                )
           + '" width="18" height="18"'
           + ' alt="Open/Close Tools Panel"'
           + ' title="Open/Close Tools Panel"'
           + ' id="' + oCs.sIdImg_Unfolder3_ForToolsBox + '"'
           + ' />'
           + '</a>'
           + '</div>'
            ;
      sHt += sDv;

      // navibox close button [seq ]
      var sDv = '<div';
      sDv += ' id="NaviBox_CloseButton_Div_' + iSliderId + '"'
           + ' style="'
           + ' position:absolute; top:3px; right:-28px;'               // [closebutton-position]
           + '">'
           + '<a href='
           + '"javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickUnfolderBtns(\'captionbox_button\');"'
           + ' style="'
           + '"'
           + '" id="NaviBox_CloseButton_Href ' + iSliderId + '"'
           + ' title="Open/Close Navigation Panel"'
           + '>'
           + '<img src="'
           + Sldgr.Cnst.sData_Btn_Cross_SteelBlue
           + '" width="18px" height="18px"'
           + ' alt="Open/Close Navigation Panel"'
           + ' id="' + oCs.sIdImg_Unfolder2_ForNaviBox + '"'
           + ' id="NaviBox_CloseButton_ImgSrc"'
           + ' />'
           + '</a>'
           + '</div>'
            ;
      if ( Sldgr.Cnst.bShow_GrowPanels_CloseButtons ) {
         sHt += sDv;
      }

      // [seq 20190323°0355]
      sHt += '</div>';

      return sHt;
   };

   /**
    * This method builds the info panel HTML fragment
    *
    * @id 20190106°0643
    * @type {String}
    */
   this.o3Build4ToolsPanel = function()
   {
      'use strict';

      var sHt = '';

      // open the controls div [seq 20190106°0647]
      sHt += '<div class="ToolsPanel_Div"'
           + ' id="' + oCs.sId_Panel4_Tools + '"'
           + ' style="'
           + ' border:0px solid Yellow;'                               // [DbgBrdr 9]
         + ' display:' + (oSt.bIsVisible03ToolsBox ? 'table' : 'none') + ';'
           + ' margin-top:0.3em;'                                      // [vertical-panel-spacing]
           + ' position:relative;'                                     // ? wanted for the unfolder button
           + ' width:' + oVr.iSliderPanelWidth + 'px;'
         + ' z-index:2;'                                               // 0 [zindex] ✱
           + '">'
            ;

      sHt += '<div'
           + ' style="font-size:small;'
           + ' font-weight:bold;'
           + '">'
           + 'Tools:'
           + '</div>'
            ;

      // wrap buttons in a div of their own [seq 20190107°0423]
      sHt += '<div id="DashboardBox_' + iSliderId + '"'
           + ' style="'
            + ' background-color:Transparent;'                         // LightGray Transparent
            + ' border:0px solid Orange;'                              // [DbgBrdr 10]
            + ' display:table-cell;'
        + ' float:right;'                                              // ?
        + ' margin-right:0.7em;'
            + ' positon:relative;'
          + ' z-index:-2;'                                             // [zindex]
             + '">'
              ;

      // toggle debug borders [seq 20190323°0541]
      sHt += '<a href="javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickUnfolderBtns(\'toggle_debug_borders\');"'
           + ' id="Button_Toggle_DebugBorders_' + iSliderId + '"'
            + ' style="'
        // + ' float:left;'
            + ' font-size:133%;'
            + ' font-weight:bold;'
            + ' position:relative; bottom:0.4em;'                      // adjust character positioning
            + ' text-decoration:none;'
            + '" title="Toggle Debug Borders"'
             + '>'
              + ( oSt.bIsVisibleDebugBorders ? '☼' : '۞')
               + '</a>&nbsp;'
                ;

      // build open/close debug panel [seq 20190106°1641]
      sHt += '<a href="javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickUnfolderBtns(\'buttonsbox_button\');"'
           + ' style="'
       // + ' float:left;'
           + ' position:relative; bottom:0.2em;'
           + ' text-decoration:none;'
           + '"'
            + ' title="Open/close Debug Panel" alt="Open/close Debug Panel"'
             + '>'
              + '<img src="' + oVr.aCtrBtns[oCs.iBtAr_On][oCs.iBtn_ToggleInfo] + '"'
               + ' id="' + oVr.aCtrBtns[oCs.iBtAr_Ids][oCs.iBtn_ToggleInfo] + '"'
                + ' width="24" height="24"'
                 + ' />'
                  + '</a>&nbsp;'
                   ;

      // build button go-back [seq 20190106°1642]
      sHt += '<a href="javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickGoOneLeft();"'
           + ' style="'
       + ' position:relative;'
      // + ' float:left;'
           + ' text-decoration:none;'
           + '"'
            + ' title="Single-step backward" alt="Button Back"'
             + '>'
              + '<img src="' + oVr.aCtrBtns[oCs.iBtAr_On][oCs.iBtn_SingleBack] + '"'
               + ' width="32" height="32"'
                + ' id="' + oVr.aCtrBtns[oCs.iBtAr_Ids][oCs.iBtn_SingleBack] + '"'
                 + ' />'
                  + '</a>&nbsp;'
                   ;

      // build button stop [seq 20190106°1643]
      sHt += '<a href="javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickAutoGoLeft();"'
           + ' style="'
       + ' position:relative;'
       //+ ' float:left;'
           + 'text-decoration:none;'
           + '"'
            + ' title="Auto-sliding start" alt="Button Move-Mode Left"'
             + '>'
              + '<img src="' + oVr.aCtrBtns[oCs.iBtAr_On][oCs.iBtn_AutoLeft] + '"'
               + ' width="32" height="32"'
                + ' id="' + oVr.aCtrBtns[oCs.iBtAr_Ids][oCs.iBtn_AutoLeft] + '"'
                 + ' />'
                  + '</a>&nbsp;'
                   ;

      // build button start [seq 20190106°1644]
      sHt += '<a href="javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickAutoGoRight();"'
           + ' style="'
      + ' position:relative;'
      //+ ' float:left;'
           + ' text-decoration:none;'
           + '"'
            + ' title="Auto-sliding stop" alt="Button Move-Mode Right"'
             + '>'
              + '<img src="' + oVr.aCtrBtns[oCs.iBtAr_On][oCs.iBtn_AutoRight] + '"'
               + ' width="32" height="32"'
                + ' id="' + oVr.aCtrBtns[oCs.iBtAr_Ids][oCs.iBtn_AutoRight] + '"'
                 + ' />'
                  + '</a>&nbsp;'
                   ;

      // build button go-forward [seq 20190106°1645]
      sHt += '<a href="javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickGoOneRight();"'
           + ' style="'
          + ' position:relative;'
       // + ' float:left;'
          + ' text-decoration:none;'
           + '"'
            + ' title="Single-step forward" alt="Button Forward"'
             + '>'
              + '<img src="' + oVr.aCtrBtns[oCs.iBtAr_On][oCs.iBtn_SingleForw] + '"'
               + ' width="32" height="32"'
                + ' id="' + oVr.aCtrBtns[oCs.iBtAr_Ids][oCs.iBtn_SingleForw] + '"'
                 + ' />'
                  + '</a>'
                   ;

      sHt += '</div>';

      // toolsbox unfolder button [seq 20190323°0451]
      var sDv = '<div';
      sDv += ' id="Div_UnfolderForButtonBox_' + iSliderId + '"'
           + ' style="'
           + ' border:0px dotted Gray;'                                // [DbgBrdr 11]
           + ' font-size:177%;'
           + ' font-weight:bold;'
           + ' position:absolute; bottom:-29px; right:-5px;'           // [unfolderbutton-position] !!!
           + '">'
           + '<a href='
           + '"javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickUnfolderBtns(\'buttonsbox_button\');"'
           + ' style="'
           + ' color:RosyBrown;'                                       // CadetBlue Fuchsia RosyBrown SteelBlue
           + ' text-decoration:none;'
           + '"'
           + ' id="' + oCs.sId_Href_Unfold_4_DebugBox + '"'
           + ' title="Open/close Debug Panel"'
           + '>'
           + '<img'
           + ' src="'
           + ( oSt.bIsVisible04DebugBox
              ? Sldgr.Cnst.sData_Btn_Left_Tomato
               : Sldgr.Cnst.sData_Btn_Down_Tomato
                )
           + '"'
           + ' width="18" height="18"'
           + ' alt="Open/Close Debug Panel"'
           + ' title="Open/Close Debug Panel"'
           + ' id="' + oCs.sIdImg_Unfolder4_ForDebugBox + '"'
           + ' />'
           + '</a>'
           + '</div>'
            ;
      sHt += sDv;

      // toolsbox close button [seq 20190314°0425]
      var sDv = '<div';
      sDv += ' id="ToolsBox_CloseButton_Div_' + iSliderId + '"'
           + ' style="'
           + ' position:absolute; top:3px; right:-28px;'               // [closebutton-position]
           + '">'
           + '<a href='
           + '"javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickUnfolderBtns(\'navibox_button\');"'
           + ' style="'
           + '"'
           + ' id="ToolsBox_CloseButton_Href_"' + iSliderId
           + ' title="Open/close Debug Panel"'
           + '>'
           + '<img src="' + Sldgr.Cnst.sData_Btn_Cross_DarkSeaGreen + '" width="18px" height="18px"'
           + ' alt="Open/Close Debug Panel"'
           + ' title="Open/Close Debug Panel"'
           + ' id="ToolsBox_CloseButton_ImgSrc_"' + iSliderId
           + ' />'
           + '</a>'
           + '</div>'
            ;
      if ( Sldgr.Cnst.bShow_GrowPanels_CloseButtons ) {
         sHt += sDv;
      }

      // complete controls div [line 20190107°0427]
      sHt += '</div>';

      return sHt;
   };

   /**
    * This method builds the info panel HTML fragment
    *
    * @id 20190106°0651
    * @type {String}
    */
   this.o3Build50DebugPanel = function()
   {
      'use strict';

      // open div [seq 20190314°0431]
      var sHt = '';
      sHt += '<div'
            + ' id="' + oCs.sId_Panel5_Debug + '"'
            + ' style="'
           + ' border:1px solid Gray;'
            + ' display:' + (oSt.bIsVisible04DebugBox ? 'table' : 'none') + ';'
           + ' margin-top:0.3em;'                                      // [vertical-panel-spacing]
            + ' position:relative;'                                    // so the unfolder button can be absolute
            + ' width:' + (oVr.iSliderPanelWidth - 8) + 'px;'          // minus 16 21 47 ???
             + '">'
              ;

      var sFrag1 = '<img'
                  + ' style="'
                  + ' position:absolute; right:1px; top:1px;'
                  + '"'
                  + ' src="' + Sldgr.Cnst.sImgSrc_PlasticineProjector + '"'
                  + ' width="48" heigh="28"'
                  + ' alt="Plasticine Projector Logo"'
                  + ' />'
                   ;
      var sFrag2 = '<img'
                  + ' style="'
                  + ' position:absolute; right:1px; bottom:1px;'
                  + '"'
                  + ' src="' + Sldgr.Cnst.sImgSrc_LogoLgpl + '"'
                  + ' width="98" heigh="34"'
                  + ' alt="Plasticine Projector Logo"'
                  + ' />'
                   ;
      sHt += sFrag1 + sFrag2;

      // () build debug table [seq 20190106°1651]
      // (.1) section header
      sHt += '<table'
           + ' style="'
           + ' border:0px dotted Orange;'                              // [DbgBrdr 12]
           + ' width:' + (oVr.iSliderPanelWidth - 17) + 'px;'
            + '">'
            + '<tr><td style="font-size:small;">'
            + '<b>SlideGear ' + Sldgr.Cnst.info.sVersion + '</b><br \><i>Debug info:</i>'
            + '</td></tr>'
             ;

      // (.3) section with fading variables [20190106°0653]
      sHt += '<tr><td style="font-size:small;">Current image &nbsp;= <span id="' + oCs.sId_Span_DbgImgShowNow + '">N/A</span></td></tr>'
           + '<tr><td style="font-size:small;">Previous image &nbsp;= <span id="' + oCs.sId_Span_DbgImgFadeOut + '">N/A</span></td></tr>'
            + '<tr><td style="font-size:small;">Fade step &nbsp;= <span id="' + oCs.sId_Span_DbgFadeState + '">N/A</span></td></tr>'
            + '<tr><td style="font-size:small;">Projections &nbsp;&nbsp;= <span id="' + oCs.sId_Span_DbgProjCount + '">N/A</span></td></tr>'
            + '<tr><td style="font-size:small;">Slider mode = <span id="' + oCs.sId_Span_DbgMoveMode + '">N/A</span></td></tr>'
            + '<tr><td style="font-size:small;">Sliding interval (ms) = <span id="' + oCs.sId_Span_DbgSlideDuration + '">N/A</span></td></tr>'
            + '<tr><td style="font-size:small;">Fading duration (s) = <span id="' + oCs.sId_Span_DbgFadeDuration + '">N/A</span></td></tr>'
             ;

      // (.4) section for debugging issue 20190312°0821 'misguided image while fading' [line 20190106°0655]
      sHt += '<tr><td>' + this.o3Build51DebugPanel_2() + '</td></tr>';

      // (.5) table ready [line 20190106°0657]
      sHt += '</table>';

      // debugbox close button [seq 20190314°0427]
      var sDv = '<div';
      sDv += ' id="DebugBox_CloseButton_Div_' + iSliderId + '"'
           + ' style="'
           + ' position:absolute; top:3px; right:-37px;'               // [closebutton-position]
           + '">'
           + '<a href='
           + '"javascript:Sldgr.Vars.arObSliders[' + iSliderId + '].oClickUnfolderBtns(\'buttonsbox_button\');"'
           + ' id="DebugBox_CloseButton_Href_' + iSliderId + '"'
           + ' title="Open/close Debug Panel"'
           + '>'
           + '<img src="' + Sldgr.Cnst.sData_Btn_Cross_Tomato + '" width="18px" height="18px"'
           + ' alt="Open/Close Debug Panel"'
           + ' title="Open/Close Debug Panel"'
           + ' id="DebugBox_CloseButton_ImgSrc_' + iSliderId + '"'
           + ' />'
           + '</a>'
           + '</div>'
            ;
      if ( Sldgr.Cnst.bShow_GrowPanels_CloseButtons ) {
         sHt += sDv;
      }

      // close div [seq 20190314°0432]
      sHt += '</div>';

      return sHt;
   };

   /**
    * This method builds the info panel HTML fragment extension
    *  to debug finished issue 20190312°0821 'misguided image'
    *
    * @id 20190323°0141
    * @type {String}
    */
   this.o3Build51DebugPanel_2 = function()
   {
      'use strict';

      // open fragment [line 20190323°0143]
      var sHt = '<table style="font-size:small;">';

      // iterate over the slides in the magazine [seq 20190323°0145]
      oVr.aMag.forEach( function( elCurr, iNdx, arr) {
         sHt += '<tr><td id=' + oCs.sId_Span_DbgSlideEleCell + iNdx +'>&nbsp';
         sHt += iNdx; // is never seen since overridden by update
         sHt += "&nbsp;</td></tr>";
      }, oSelf);

      // close fragment [line 20190323°0147]
      sHt  += "</table>";

      return sHt;

   };

      /**
    * This method builds the div-stock helper array
    *
    * @id 20190106°1941
    * @callers Only • startup
    */
   this.o4FillMagazine = function()
   {
      'use strict';

      // [seq 20190106°1943]
      for ( var iImg = 0; iImg < oVr.aMag.length; iImg++ ) {
         // [seq 20190107°0341]
         var eDiv = document.getElementById(oCs.sId_Div_Stock + iImg);
         oVr.aMag[iImg].eSliDiv = eDiv;
      }
   };

   /**
    * This method starts the show if autostart is set true
    *
    * @id 20190106°0711
    * @callers Only • startup
    */
   this.o5Autostart = function()
   {
      'use strict';

      // preparation [seq 20190106°0712]
      oVr.Stage.iNdxCurr = oSelf.iStartImageNdx;
      oVr.Stage.iNdxPrev = null; // experiment 20190323°0211 works fine

      // obey setting [seq 20190106°0713]
      if ( oSt.bAutostart ) {

         // set auto-move direction
         if ( oVr.Stage.iMode !== Sldgr.Cnst.Mode.Left ) {
            oVr.Stage.iMode = Sldgr.Cnst.Mode.Right;
         }
      }

      // set buttons [seq 20190106°0714]
      oSelf.oUpdateButtons();

      // show initial slide immediately [seq 20190106°0715]
      oSelf.oSlideProjectNext(oSelf.iStartImageNdx);
   };

   /**
    * This method is the event handler for the move-mode-left button
    *
    * @id 20190106°0811
    */
   this.oClickAutoGoLeft = function()
   {
      'use strict';

      // [seq 20190106°0813]
      if ( oVr.Stage.iMode === Sldgr.Cnst.Mode.Left ) {
         oVr.Stage.iMode = Sldgr.Cnst.Mode.Single;
      } else {
         oVr.Stage.iMode = Sldgr.Cnst.Mode.Left;
      }

      // [seq 20190106°0815]
      oSelf.oUpdateButtons();
      oSelf.oSlideProjectNext();
   };

   /**
    * This method is the event handler for the move-mode-right button
    *
    * @id 20190106°0751
    */
   this.oClickAutoGoRight = function()
   {
      'use strict';

      // [seq 20190106°0753]
      if ( oVr.Stage.iMode === Sldgr.Cnst.Mode.Right ) {
         oVr.Stage.iMode = Sldgr.Cnst.Mode.Single;
      } else {
         oVr.Stage.iMode = Sldgr.Cnst.Mode.Right;
      }

      // [seq 20190106°0755]
      oSelf.oUpdateButtons();
      oSelf.oSlideProjectNext();
   };

   /**
    * This method is the event handler for the go-back button
    *
    * @id 20190106°0721
    */
   this.oClickGoOneLeft = function()
   {
      'use strict';

      // [seq 20190106°0723]
      oVr.Stage.iMode = Sldgr.Cnst.Mode.Single;
      oSelf.oUpdateButtons();
      var iGoto = (oVr.Stage.iNdxCurr < 1) ? oVr.aMag.length - 1 : oVr.Stage.iNdxCurr - 1;

      // ignit movement, here with provisory debug helper flag [seq 20190106°0725]
      oSelf.oSlideProjectNext(iGoto, true); // true = go-without-fading
   };

   /**
    * This method is the event handler for the go-forward button
    *
    * @id 20190106°0731
    */
   this.oClickGoOneRight = function()
   {
      'use strict';

      // [seq 20190106°0733]
      oVr.Stage.iMode = Sldgr.Cnst.Mode.Single;
      oSelf.oUpdateButtons();
      var iGoto = (oVr.Stage.iNdxCurr < oVr.aMag.length) ? oVr.Stage.iNdxCurr + 1 : 0;
      oSelf.oSlideProjectNext(iGoto, true);
   };

   /**
    * This method is the event handler for a goto-image link
    *
    * @id 20190106°0741
    * @param {Integer} iNumSelected The number of the image to trigger
    */
   this.oClickGoSelected = function(iNumSelected)
   {
      'use strict';

      // [seq 20190106°0743]
      oVr.Stage.iMode = Sldgr.Cnst.Mode.Single;
      oSelf.oUpdateButtons();
      oSelf.oSlideProjectNext(iNumSelected - 1, true); // use index (-1) not number, true = go-hard
   };

   /**
    * This method opens/closes the caption bar
    *
    * @id 20190323°0331
    * @callers • onclick events in buttons
    * @param sButtonName {String} The signature of the button which was pressed
    * @returns {Void} 
    */
   this.oClickUnfolderBtns = function(sButtonName)
   {
      'use strict';

      // proglogue [seq 20190323°0511]
      //

      // [seq 20190323°0512]
      switch (sButtonName) {

         // () process primary unfolder button [seq 20190323°0513]
         case 'primary_button' :

            // () process flag [seq 20190314°0141]
            oSt.bIsVisible01CaptionBox = oSt.bIsVisible01CaptionBox ? false : true;
            break;

         // process caption panel unfolder button [seq 20190323°0514]
         case 'captionbox_button' :

            // [seq 20190314°0143]
            oSt.bIsVisible02NaviBox = oSt.bIsVisible02NaviBox ? false : true;
            break;

         // process navibox unfolder button [seq 20190323°0515]
         case 'navibox_button' :

            // [seq 20190314°0145]
            oSt.bIsVisible03ToolsBox = oSt.bIsVisible03ToolsBox ? false : true;
            break;

         // process buttonsbox unfolder button [seq 20190323°0516]
         case 'buttonsbox_button' :

            // [seq 20190314°0147]
            oSt.bIsVisible04DebugBox = oSt.bIsVisible04DebugBox ? false : true;
            break;

         // process debug borders button [seq 20190323°0543]
         case 'toggle_debug_borders' :

            oSt.bIsVisibleDebugBorders = oSt.bIsVisibleDebugBorders ? false : true;
            oSelf.oUpdateBorders();
            break;

         // program flow error [seq 20190323°0517]
         default :
            break;
      }


      // skip
      if (sButtonName === 'toggle_debug_borders') {
         return;
      }

      // quick workaround to enforce valid unfolder order [seq 20190314°0545]
      // note : Compare seq 20190314°0541
      if (oSt.bIsVisible01CaptionBox === false ) { oSt.bIsVisible02NaviBox = false; }
      if (oSt.bIsVisible02NaviBox === false ) { oSt.bIsVisible03ToolsBox = false; }
      if (oSt.bIsVisible03ToolsBox === false ) { oSt.bIsVisible04DebugBox = false; }

      // [line 20190315°0413] experiment -- success
      var sImgSrc = ( oSt.bIsVisible01CaptionBox
                   ? Sldgr.Cnst.sData_Btn_Left_SlateGray
                    : Sldgr.Cnst.sData_Btn_Down_SlateGray
                     )

      // process caption panel unfolder button [seq 20190314°0611]
      var eButImg = document.getElementById(oCs.sIdImg_Unfolder1_ForCaptionBox);
      eButImg.src = sImgSrc;
      var ePanel = document.getElementById(oCs.sId_Panel2_Caption);
      ePanel.style.display = oSt.bIsVisible01CaptionBox ? 'block' : 'none';

      // process navigatino panel unfolder button [seq 20190314°0613]
      var eButImg = document.getElementById(oCs.sIdImg_Unfolder2_ForNaviBox);
      eButImg.src = ( oSt.bIsVisible02NaviBox
                     ? Sldgr.Cnst.sData_Btn_Left_SteelBlue
                      : Sldgr.Cnst.sData_Btn_Down_SteelBlue
                       );
      var ePanel = document.getElementById(oCs.sId_Panel3_Navigation);
      ePanel.style.display = oSt.bIsVisible02NaviBox ? 'block' : 'none';

      // process tools panel unfolder button [seq 20190314°0615]
      var eButImg = document.getElementById(oCs.sIdImg_Unfolder3_ForToolsBox);
      eButImg.src = ( oSt.bIsVisible03ToolsBox
                     ? Sldgr.Cnst.sData_Btn_Left_DarkSeaGreen
                      : Sldgr.Cnst.sData_Btn_Down_DarkSeaGreen
                       );
      var ePanel = document.getElementById(oCs.sId_Panel4_Tools);
      ePanel.style.display = oSt.bIsVisible03ToolsBox ? 'table' : 'none';

      // process debug panel unfolder button [seq 20190314°0617]
      var eButImg = document.getElementById(oCs.sIdImg_Unfolder4_ForDebugBox);
      eButImg.src = ( oSt.bIsVisible04DebugBox
                     ? Sldgr.Cnst.sData_Btn_Left_Tomato
                      : Sldgr.Cnst.sData_Btn_Down_Tomato
                       );
      var ePanel = document.getElementById(oCs.sId_Panel5_Debug);
      ePanel.style.display = oSt.bIsVisible04DebugBox ? 'table' : 'none';

      // actualize Toggle-Info-Panel Button [line 20190323Â°0519]
      oSelf.oUpdateButtons();

      // debug [line 20190323°0521]
      if ( Sldgr.Vars.bDebugGeneral ) {
         var s = 'Unfolder Button pressed : "' + sButtonName + '"';
         Sldgr.Func.pgOutDebug(s, 'f.5', iSliderId);
      }
   };

   /**
    * This method triggers the next slide
    *
    * @id 20190106°0841
    * @callers Only • oSlideProjectNext either via timer or directly via button
    */
   this.oSlideProject = function()
   {
      'use strict';

      // prologue [seq 20190106°2011]
      oSelf.iDebugProjectCounter += 1;

      // maintain fading [seq 20190106°0843]
      if (oVr.Stage.iFadeCount > 0) {
         oVr.Stage.iFadeCount -= 1;
      }
      if (oVr.Stage.iFadeCount < 1) {
         clearTimeout(oVr.timerFade);
      }

      // provide debug info [seq 20190106°0845]
      oSelf.oSlideProject_Output();

      // calculate alpha [seq 20190106°2111]
      var nAlphaGrow = 1 - (1 / oSt.iFadingSteps * oVr.Stage.iFadeCount);
      var nAlphaWane = 1 - nAlphaGrow; // [line 20190314°0531] fight issue 20190314°0527 'previous image overlays new'

      // [seq 20190106°2021]
      oVr.aMag[oVr.Stage.iNdxPrev].eSliDiv.style.zIndex = 1;
      oVr.aMag[oVr.Stage.iNdxPrev].eSliDiv.style.visibility = 'visible'; // only while fading
      oVr.aMag[oVr.Stage.iNdxPrev].eSliDiv.style.filter = 'Alpha(Opacity = ' + (nAlphaWane * 100) + ')';
      oVr.aMag[oVr.Stage.iNdxPrev].eSliDiv.style.MozOpacity = nAlphaWane; // seems outdated
      oVr.aMag[oVr.Stage.iNdxPrev].eSliDiv.style.opacity = nAlphaWane;

      oVr.aMag[oVr.Stage.iNdxCurr].eSliDiv.style.zIndex = 2;
      oVr.aMag[oVr.Stage.iNdxCurr].eSliDiv.style.visibility = 'visible';
      oVr.aMag[oVr.Stage.iNdxCurr].eSliDiv.style.filter = 'Alpha(Opacity = ' + (nAlphaGrow * 100) + ')';
      oVr.aMag[oVr.Stage.iNdxCurr].eSliDiv.style.MozOpacity = nAlphaGrow;
      oVr.aMag[oVr.Stage.iNdxCurr].eSliDiv.style.opacity = nAlphaGrow;

      // next slide [condition 20190106°2023]
      if ( oVr.Stage.iMode !== Sldgr.Cnst.Mode.Single ) {

         // the last fading round is special [condition 20190106°2025]
         if ((oVr.Stage.iFadeCount < 1) ) {

            // prepare the next slide
            oVr.timerSlide = setTimeout ( function()
                                         { oSelf.oSlideProjectNext(); }
                                          , oSt.iShowingDuration
                                           );}
      }

      // maintain direct navigation [line 20190323°0121]
      // note : Compare line 20190323°0123 for building the ID attribute
      var sIdPrev = 'DirectNav_' + iSliderId + '_' + (oVr.Stage.iNdxPrev + 1);
      var elPrev = document.getElementById(sIdPrev);
      if (elPrev !== null) {
         elPrev.className = 'DirectNavNormal';
      }

      // [seq 20190106°0847]
      var sIdCurr = 'DirectNav_' + iSliderId + '_' + (oVr.Stage.iNdxCurr + 1);
      var elCurr = document.getElementById(sIdCurr);
      if (elCurr !== null) {
         elCurr.className = 'DirectNavActive';
      }

   };

   /**
    * This method heads on the projector for next slide
    *
    * @id 20190108°0331
    * todo : Fix issue 20190312°0821 'misguided image appears while fading'
    * @callers • o5Autostart (timer/immediately) • oClickGoOneLeft • oClickGoOneRight
    *     • oClickGoSelected • oClickAutoGoLeft • oClickAutoGoRight • oSlideProject (timer)
    * @param {Integer} iNdxTarget Mostly null, otherwise explicit image request
    * @param {Boolean} bDebug Debug helper flag
    */
   this.oSlideProjectNext = function(iNdxTarget, bGoHard)
   {
      'use strict';

      // if a next image is ordered, any possible fading ends [line 20190108°0332]
      // todo 20190323°0215 : If fading is interrupted, its important final
      //    cycle in condition 20190106°2025 is not executed. That needs to
      //    be replaced somehow otherwise.
      clearTimeout(oVr.timerFade);

      // [line 20190108°0333]
      // todo : Can probably be done shorter. Find canonical way to do this.
      bGoHard = (( typeof bGoHard !== 'undefined' ) || (bGoHard === null)) ? bGoHard : false;

      // debug [seq 20190108°0334]
      if ( bGoHard ) { // primitive selection
         if ( Sldgr.Vars.bDbgOut_5_go_next_slide ) {
            var s = "oSlideProjectNext iNdxTarget = " + iNdxTarget;
            Sldgr.Func.pgOutDebug(s, 'f.6', iSliderId);
         }
      }

      // retire the now no more involved image [seq 20190323°0221]
      //  Remember issue 20190312°0821 'misguided image', looks like this helped.
      if ( oVr.Stage.iNdxPrev !== null ) {
         oVr.aMag[oVr.Stage.iNdxPrev].eSliDiv.style.visibility = 'hidden';
      }

      // maintain cursor prev [line 20190108°0335]
      oVr.Stage.iNdxPrev = oVr.Stage.iNdxCurr;

      // maintain cursor curr [seq 20190108°0336]
      if ( ( typeof iNdxTarget !== 'undefined' ) || (iNdxTarget === null) ) {
         oVr.Stage.iNdxCurr = iNdxTarget;
      } else if ( oVr.Stage.iMode === Sldgr.Cnst.Mode.Right ) {
         oVr.Stage.iNdxCurr += 1;
      } else if ( oVr.Stage.iMode === Sldgr.Cnst.Mode.Left ) {
         oVr.Stage.iNdxCurr -= 1;
      }

      // wrap cursor [seq 20190108°0337]
      if ( oVr.Stage.iNdxCurr >= oVr.aMag.length ) {
         oVr.Stage.iNdxCurr = 0;
      } else if ( oVr.Stage.iNdxCurr < 0 ) {
         oVr.Stage.iNdxCurr = oVr.aMag.length - 1;
      }

      // maintain image caption [line 20190106°2041]
      this.oUpdateImageCaption();

      // maintain fading [seq 20190108°0338]
      oVr.Stage.iFadeCount = 0; // 1; // results in no fading
      var nFadeStepTime = 0; // 1;
      if ( bGoHard ) {
         clearTimeout(oVr.timerSlide);
      } else {
         if ( oVr.Stage.iFadingAlgo === Sldgr.Cnst.CmdFade.Soft ) {
            oVr.Stage.iFadeCount = oSt.iFadingSteps + 1;
            nFadeStepTime = oSt.iFadingDuration * 1000 / oSt.iFadingSteps;
         }
      }

      // start fading [seq 20190323°0243]
      oVr.timerFade = setInterval ( function()
                                   { oSelf.oSlideProject(); }
                                    , nFadeStepTime
                                     );
      oSelf.oSlideProject(); // immediate first cycle
   };

   /**
    * This method outputs debug info
    *
    * @id 20190108°0511
    * @callers Only • oSlideProject
    */
   this.oSlideProject_Output = function()
   {
      'use strict';

      // optional debug [seq 20190106°2016]
      if ( Sldgr.Vars.bDbgOut_6_slide_trigger ) {
         var el = document.getElementById(oCs.sId_Src_Image + oVr.Stage.iNdxCurr);
         var s = 'trigger no ' + (oVr.Stage.iNdxCurr + 1) + ' (' + el.width + ' * ' + el.height + ')'
                + ' ' + oVr.aMag[oVr.Stage.iNdxCurr].sImgPath
                 ;
         Sldgr.Func.pgOutDebug(s, 'f.7', iSliderId);
      }

      // [seq 20190108°0513]
      var sMovMod = '';
      switch (oVr.Stage.iMode) {
         case Sldgr.Cnst.Mode.Left : sMovMod = 'auto backward' ; break ;
         case Sldgr.Cnst.Mode.Right : sMovMod = 'auto forward' ; break ;
         case Sldgr.Cnst.Mode.Single : sMovMod = 'manual steps' ; break ;
         default : sMovMod = 'N/A' ;
      }

      // routine debug output [seq 20190106°2017]
      document.getElementById(oCs.sId_Span_DbgFadeState).innerHTML  = '' + oVr.Stage.iFadeCount;
      document.getElementById(oCs.sId_Span_DbgImgFadeOut).innerHTML = (oVr.Stage.iNdxPrev + 1);
      document.getElementById(oCs.sId_Span_DbgImgShowNow).innerHTML = (oVr.Stage.iNdxCurr + 1);
      document.getElementById(oCs.sId_Span_DbgProjCount).innerHTML = oSelf.iDebugProjectCounter;
      document.getElementById(oCs.sId_Span_DbgMoveMode).innerHTML = sMovMod;
      document.getElementById(oCs.sId_Span_DbgSlideDuration).innerHTML = oSt.iShowingDuration;
      document.getElementById(oCs.sId_Span_DbgFadeDuration).innerHTML = oSt.iFadingDuration;

      // debug [seq 20190323°0153]
      //  Analyse issue 20190312°0821 'misguided image' and
      //   issue 20190314°0527 'previous image overlays new'
      oVr.aMag.forEach( function( elCurr, iNdx, arr) {
         // [line 20190108°0514]
         var sInfo = '' + (iNdx + 1)
                    + '&nbsp;' + elCurr.eSliDiv.style.visibility
                     + '&nbsp;' + elCurr.eSliDiv.style.opacity
                      ;

         // [seq 20190108°0515]
         var sId = oCs.sId_Span_DbgSlideEleCell + iNdx;
         document.getElementById(sId).innerHTML = sInfo;
      }, oSelf);

   };

   /**
    * This method updates the debug borders
    *
    * @id 20190323°0551
    */
   this.oUpdateBorders = function()
   {
      'use strict';

      // [seq 20190323°0553]
      var aEls = Array();
      aEls.push('Sg_SliderPanelOuterDiv_' + iSliderId);   // [DbgBrdr 1] border:3px dotted Tomato;
      aEls.push('Sg_ImageSequence_' + iSliderId);         // [DbgBrdr 2] border:3px dashed LimeGreen;'
      aEls.push(oCs.sId_Href_Unfold_1_CaptionBox);        // [DbgBrdr 3] border:3px dotted Gray;
      aEls.push(oCs.sId_Panel2_Caption);                  // [DbgBrdr 4] border:3px solid LightGreen;
      aEls.push(oCs.sId_Caption_Text);                    // [DbgBrdr 5] border:2px dotted RoyalBlue;
      aEls.push(oCs.sId_Href_Unfold_2_NaviBox);           // [DbgBrdr 6] border:1px dotted Gray;
      aEls.push(oCs.sId_Panel3_Navigation);               // [DbgBrdr 7] border:3px solid Chocolate;
      aEls.push('Div_UnfolderForNaviBox_' + iSliderId);   // [DbgBrdr 8] border:1px dotted Gray;
      aEls.push(oCs.sId_Panel4_Tools);                    // [DbgBrdr 9] border:3px solid Yellow;
      aEls.push('DashboardBox_' + iSliderId);             // [DbgBrdr 10] border:2px solid Red;
      aEls.push('Div_UnfolderForButtonBox_' + iSliderId); // [DbgBrdr 11] border:1px dotted Gray;
      aEls.push(oCs.sId_Panel5_Debug);                    // [DbgBrdr 12] border:3px dotted Orange;

      // [seq 20190323°0555]
      aEls.forEach( function( sEleId ) {
         var ele = document.getElementById(sEleId);
         ele.style.borderWidth = (oSt.bIsVisibleDebugBorders ? '2px' : '0px');
      }, oSelf);

      var aBut = document.getElementById('Button_Toggle_DebugBorders_' + iSliderId);
      aBut.innerHTML = (oSt.bIsVisibleDebugBorders ? '☼' : '۞');

   };

   /**
    * This method updates the buttons
    *
    * todo : Fix issue 20190312°0831 'wrong title on auto-sliding buttons'
    * @id 20190106°0851
    */
   this.oUpdateButtons = function()
   {
      'use strict';

      // get target elements [seq 0190106°0853]
      var el1 = document.getElementById(oVr.aCtrBtns[oCs.iBtAr_Ids][oCs.iBtn_AutoRight]);   // "Button_0_1"
      var el2 = document.getElementById(oVr.aCtrBtns[oCs.iBtAr_Ids][oCs.iBtn_AutoLeft]);    // "Button_0_2"
      var el3 = document.getElementById(oVr.aCtrBtns[oCs.iBtAr_Ids][oCs.iBtn_ToggleInfo]);  //
      var elBk = document.getElementById('NaviPanelButton_AutoBackward_' + iSliderId);
      var elFw = document.getElementById('NaviPanelButton_AutoForward_' + iSliderId);

      // maintain move buttons [seq 0190106°0855]
      if (oVr.Stage.iMode === Sldgr.Cnst.Mode.Right) {
         el1.src = oVr.aCtrBtns[oCs.iBtAr_Off][oCs.iBtn_AutoRight];
         el2.src = oVr.aCtrBtns[oCs.iBtAr_On][oCs.iBtn_AutoLeft];
         elBk.innerHTML = '◁';
         elBk.title = 'Auto Slide Backward';
         elFw.innerHTML = '◈';
         elFw.title = 'Stop Auto Slide';
      } else if (oVr.Stage.iMode === Sldgr.Cnst.Mode.Left) {
         el1.src = oVr.aCtrBtns[oCs.iBtAr_On][oCs.iBtn_AutoRight];
         el2.src = oVr.aCtrBtns[oCs.iBtAr_Off][oCs.iBtn_AutoLeft];
         elBk.innerHTML = '◈';
         elBk.title = 'Stop Auto Slide';
         elFw.innerHTML = '▷';
         elFw.title = 'Auto Slide Forward';
      } else {
         el1.src = oVr.aCtrBtns[oCs.iBtAr_On][oCs.iBtn_AutoRight];
         el2.src = oVr.aCtrBtns[oCs.iBtAr_On][oCs.iBtn_AutoLeft];
         elBk.innerHTML = '◁';
         elBk.title = 'Auto Slide Backward';
         elFw.innerHTML = '▷';
         elFw.title = 'Auto Slide Forward';
      }

      // maintain info button [seq 0190106°0857]
      if ( oSt.bIsVisible04DebugBox ) {
         el3.src = oVr.aCtrBtns[oCs.iBtAr_Off][oCs.iBtn_ToggleInfo];
      }
      else {
         el3.src = oVr.aCtrBtns[oCs.iBtAr_On][oCs.iBtn_ToggleInfo];
      }
   };

   /**
    * This method updates the image text
    *
    * @id 20190106°0911
    * @callers Only • oSlideProjectNext
    */
   this.oUpdateImageCaption = function()
   {
      'use strict';

      // [seq 20190106°0913]
      var ele = document.getElementById(oCs.sId_Caption_Text);
      ele.innerHTML = "<small>(" + (oVr.Stage.iNdxCurr + 1) + "<small>/"
                     + oVr.aMag.length + "</small>)</small> "
                      + oVr.aMag[oVr.Stage.iNdxCurr].sImgText
                       ;
   };

   // do some constructor tasks [line 20190106°0915]
   oSelf.o1Slideshow_Code();

   // one slider object is constructed but not initialized [note 20190106°0917]
   return;
};

/**
 * This method outputs one debug message
 *
 * @id 20190106°0511
 * @todo : This is a page function, not an object method, except for
 *    the prefix calculation. Thus perhaps shift it to script level.
 * @callers • many
 * @param {string} sMsg The message to output
 */
Sldgr.Func.pgOutDebug = function(sMsg, sDbgId, iSlidrId)
{
   'use strict';

   // general switch [seq 20190314o0313]
   if (! Sldgr.Vars.bDebugGeneral) {
      return;
   }

   // prologue [seq 20190106°0512]
   var bRevers = true; // false true
   Sldgr.Vars.iOutputLineCounter += 1;
   var elOut = document.getElementById('SG_Debug_Output_Pane');

   // output is only possible with the area [seq 20190106°0513]
   if (elOut === null) {

      var elOut = document.createElement("pre");
      elOut.id = 'SG_Debug_Output_Pane';
      elOut.innerHTML = '0 [] Creating the Debug Pane.';
      elOut.style.backgroundColor = 'Khaki'; // Khaki Moccasin
      elOut.style.clear = 'both';
      elOut.style.margin = '1.7em';
      elOut.style.padding = '0.7em';

      var a = document.body.childNodes;
      var elTgt = a[a.length - 4];
      document.body.insertBefore(elOut, elTgt);
   }

   // primitive encoding [seq 20190314°0711]
   sMsg = sMsg.replace(/</g , '&lt;');
   sMsg = sMsg.replace(/>/g , '&gt;');

   // build line [seq 20190106°0514]
   var sLine = Sldgr.Vars.iOutputLineCounter + ' [';
   if ( typeof iSlidrId !== undefined ) {
      sLine += 'Gear ' + (iSlidrId + 1);
   }
   if ( typeof sDbgId !== undefined ) {
      sLine += ' ' + sDbgId;
   }
   sLine += ']';
   sLine += ' ' + sMsg;

   // update HTML [seq 20190106°0515]
   var sHt = elOut.innerHTML;
   if ( bRevers ) {
      sHt = sLine + '\n' + sHt;
   }
   else {
      sHt += '\n' + sLine;
   }
   elOut.innerHTML = sHt;
};

/**
 * This function creates and starts all sliders on the page
 *
 * @id 20190106°0241
 * @callers  • this scriptlevel (if inside Daftari) • onload-event (if standalone)
 */
Sldgr.Func.startup = function ()
{
   'use strict';

   // () smarten page [line 20190106°0242]
   Sldgr.Func.injectStyleRules();

   // (1) collect all HTML slider elements on the page [seq 20190106°0243]
   // note : See ref 20190323°0323 'MDN → Document.querySelectorAll'
   var sQuSel = 'div[' + Sldgr.Cnst.sPlate_DataSlidegearAttrib + ']'; // 'data-slidegear'
   Sldgr.Vars.arDivSliders = document.querySelectorAll(sQuSel);

   // (2) iterate over the found HTML slider elements [line 20190106°0244]
   for ( var iSliderId = 0; iSliderId < Sldgr.Vars.arDivSliders.length; iSliderId++ )
   {
      // (2.1) create Slideshow instance for this HTML slider element
      Sldgr.Vars.arObSliders[iSliderId] = new Sldgr.Func.o1Slideshow( iSliderId );

      // comfort
      var oSlf = Sldgr.Vars.arObSliders[iSliderId];

      // (2.2) initial setup
      oSlf.o2ReadSetup();

      // (2.3) create the HTML
      oSlf.o3Build0Html();

      // (2.4) create the div stock helper array
      oSlf.o4FillMagazine();

      // (2.5) process autostart flag
      oSlf.o5Autostart();
   }

   return;
};

/**
 * This ~constant tells the default value for the autostart setting
 *
 * @id 20190106°0951
 * @type {Boolean}
 */
Sldgr.Cnst.bDefault_Autostart = true; // true false

/**
 * This ~constant tells the default value for the random-order setting
 *
 * @id 20190106°1033
 * @type {Boolean}
 */
Sldgr.Cnst.bDefault_RandomOrder = false;

/**
 * This ~constant tells the default value for the random-start setting
 *
 * @id 20190106°1031
 * @type {Boolean}
 */
Sldgr.Cnst.bDefault_RandomStart = false;

/**
 * This constant flag tells whether to show the panel close buttons or not.
 *
 * @id 20190314°0521
 * @note Not sure yet what to do
 * @type {Boolean}
 */
Sldgr.Cnst.bShow_GrowPanels_CloseButtons = false; // true false

/**
 * This ~constant tells the default control set number
 *
 * @id 20190106°1531
 * @type {Integer}
 */
Sldgr.Cnst.iDefault_ControlSet = 2;

/**
 * This ~constant tells the default fading steps number
 *
 * @id 20190106°1041
 * @type {Integer}
 */
Sldgr.Cnst.iDefault_FadingSteps = 16;

/**
 * This ~constant tells the default start image number
 *
 * @id 20190108°0211iDefault_StartImgNo
 * @type {Integer}
 */
Sldgr.Cnst.iDefault_StartImgNo = 1;

/**
 * This ~constant tells the number of fields in the user input array
 *
 * @id 20190106°1511
 * @type {Integer}
 */
Sldgr.Cnst.iRecordWidth_Input = 3;

/**
 * This ~constant tells the number of fields in the stock records array
 *
 * @id 20190107°0337
 * @type {Integer}
 */
Sldgr.Cnst.iRecordWidth_Stock = 4;

/**
 * This ~constant tells the index of field duration-factor
 *
 * @id 20190106°1051
 * @type {Integer}
 */
Sldgr.Cnst.iStkFld_Factor = 1;

/**
 * This ~constant tells index of field image-path in the record
 *
 * @id 20190106°1111
 * @type {Integer}
 */
Sldgr.Cnst.iStkFld_Path = 0;

/**
 * This ~constant tells the index of field image-text
 *
 * @id 20190106°1121
 * @type {Integer}
 */
Sldgr.Cnst.iStkFld_Text = 2;

/**
 * This ~constant tells the default fading time in seconds
 *
 * @id 20190106°1131
 */
Sldgr.Cnst.nDefault_FadingDuration = 0.9; // 0.9; 1.1;

/**
 * This ~constant the default fading time in seconds
 *
 * @id 20190106°1141
 */
Sldgr.Cnst.nDefault_ShowingDuration = 2.7;

/**
 * This ~constant object constitutes an enum for move commands
 *
 * @id 20190106°1151
 * @note Use only negative values as commands, positive values mean image numbers
 * @note Do not use zero with 'Enums', it yields trouble with comparisons
 * @type {Object}
 */
Sldgr.Cnst.CmdMove = {
   Next : -2
   , Prev : -1
   , Start : -3
};

/**
 * This Enum defines the fading algorithms (not much implemented)
 *
 * @id 20190107°0711
 * @type {Object}
 */
Sldgr.Cnst.CmdFade = {
   Hard : 1
   , Soft : 2
   , Other_NOTYETUSED : 3
};

/**
 * This Enum tells the current move operation mode
 *
 * @id 20190108°0433
 * @type {Object}
 */
Sldgr.Cnst.Mode = {
   Single : 1
   , Right : 2
   , Left : 3
};

/**
 * This namespace holds variables
 *
 * @id 20190106°0225
 */
Sldgr.Vars = Sldgr.Vars || {};

/**
 * This variable stores the HTML slider div elements -- todo : UNWANTED?!
 *
 * @id 20190106°0231
 */
Sldgr.Vars.arDivSliders = [];

/**
 * This array serves for the image input via various channels
 *
 * @id 20190106°1211
 * @summary This array onedimensiona, with three fields for each image.
 *     There exists only one single of it, which is processed before a
 *     Slider object is created. It is then used again with a different
 *     image source before the next Slider is created.
 */
Sldgr.Vars.arImgImport = [];

/**
 * This variable stores the constructed slideshow objects
 *
 * @id 20190106°0233
 * @todo : Possibly merge the two arrays 20190106°0233 Sldgr.Vars.arObSliders
 *    and 20190106°0231 Sldgr.Vars.arDivSliders into one twodimenstional array.
 */
Sldgr.Vars.arObSliders = [];

/**
 * This flag shall tell whether this script runs standalone or was called by other script
 *
 * @id 20190106°1931
 */
Sldgr.Vars.bCalledFromDaftari = false;

/**
 * Flag as quick'n'dirty brute-force fix as long we have no elegant better solution
 *
 * @id 20190210°0211
 */
Sldgr.Vars.bButtonPathesCompleted_OBSOLETE = false;

/**
 * This flag switches debug messages on/off
 *
 * @id 20190108°0251
 * @type {Boolean}
 */
Sldgr.Vars.bDbgOut_1_CalcImageSize = false; // true false

/**
 * @id 20190107°0353
 * @type {Boolean}
 */
Sldgr.Vars.bDbgOut_2_slider_constructor = true; // false true

/**
 * @id 20190314°0311
 * @type {Boolean}
 */
Sldgr.Vars.bDebugGeneral = false; // false true


/**
 * @id 20190107°0641
 * @type {Boolean}
 */
Sldgr.Vars.bDbgOut_3_read_setup = true; // false true

/**
 * @id 20190107°0355
 * @type {Boolean}
 */
Sldgr.Vars.bDbgOut_4_build_img_seq = true; // false true

/**
 * @id 20190312°0951
 * @type {Boolean}
 */
Sldgr.Vars.bDbgOut_5_go_next_slide = true; // false true

/**
 * @id 20190107°0357
 * @type {Boolean}
 */
Sldgr.Vars.bDbgOut_6_slide_trigger = false; // false true

/**
 * This var counts the lines of the debug output
 *12
 * @id 20190107°0421
 */
Sldgr.Vars.iOutputLineCounter = 0;

/**
 * This property tells the abssolute URL to the script folder
 *
 * @id 20190210°0133
 * @note E.g. "file:///G:/work/slidegeardev/trunk/slidegear/"
 * @type String
 */
Sldgr.Cnst.s_ThisScriptFolderAbs_NOTUSED = '';

/**
 * This property tells the relative path from the page to the script folder
 *
 * @id 20190210°0135
 * @note Relative path from sitmapdaf.js e.g. './../../daftari'
 * @note This is currently not used, but it should stay routinely available.
 *    • It is wanted to calculate the pathes for images relative to this
 *       script,e.g. buttons and the fallback images.
 *    • After we replaced those by base64 embedding, the path is *no more wanted*.
 *    • Func 20190315°0211 scriptPathInfo is now also not needed but should stay
 * @type String
 */
Sldgr.Cnst.s_ThisScriptFolderRel = '';

/**
 * This constant provides the image source prefix
 *
 * @id 20190315°0351
 * @type String
 */
Sldgr.Cnst.sImgSrc_Prefix = 'data:image/png;base64,';

/**
 * This constant holds the data from file 20190323o0725.leftdarkseagreen.v0.png
 *
 * @id 20190315°0335
 * @type String
 */
Sldgr.Cnst.sData_Btn_Cross_DarkSeaGreen = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MDGgsQOEqVS4kAAAK1SURBVHja'
            + '7Z1LcttAEMUoXM0X0k3sAyVnU1ZJVSpO/KOimQZmpWW/B9AWVSz25fnb8+24w7k+XS9H5/Tz8v3l'
            + 'VF7sMmjnPp2y28DB30iAJFi/Q3YPEPwNBEiCdTtjWqDgLyxAEqzXEdMDBn9BAZJgnU6wBQ7+QgIk'
            + 'weM7wF6APTsV4c5MhbizUjHujFSQOxsV5c5EhbmzUHHuDFSge3Z2eXhzRwlWn/n6dL3w80OF+uD/'
            + '9i8gCXzw//gOkAQu+K9+CUwCD/y/3gUkgQP+P28Dk2A+/Dd/B0iC2fDfFCAJZsN/lwBJMBf+uwVI'
            + 'gpnwPyRAEsyD/2EB7BJMg/8pAawSTIT/aQFsEkyF/yUBLBJMhv9lAaZLMB3+KQJMlcAA/zQBpklg'
            + 'gX+qAFMkMME/XYDdJbDBv4sAu0pghH8cx3G53W7/9SrrrHVBsevgwd9AgCRYvzumBAn+wgIkwbpd'
            + 'MTVY8BcUIAnW6wZL0OAvJEASrNMF1uDBX0AAuwQrZKci3JmpEHdWKsadkQpyZ6Oi3JmoMHcWKs6d'
            + 'gQp0z05FumemQt2z0lV1/tnpYditBOhVsWIBelm0WIBeFy8WoIURYgFaGSMWoKVRYgFaGycWoMWR'
            + 'YgFaHSsWoOXRYgFaHy8WoJdIPLYDgu+WgOC7JSD4bgkIvlsCgu+WgOC7JSD4bgmww9/hOcN7dkjw'
            + '3RLQle/+S0Dw3RIQfLcEBN8tAcF3S0Dw3RIQfLcEBN8tAcF3S0Dw3RIQfLcEBN8tAcF3S0Dw3RIQ'
            + 'fLcEBN8tAcF3S0Dw3RIQfLcEBN8twa/18cF/zH34ow/Bd89N8N3ztzBCnqOVMfI8LY2S52ptnDxf'
            + 'iyPlOVsdK8/b8mh57tbHy/MTfLcEBN8tAcF3S0Dw3RIQfLcEBN8tAcF3S0Dw3RIQfLcEBN8tAcF3'
            + 'S/ADItu971wDdz4AAAAASUVORK5CYII='
             ;

/**
 * This constant holds the data from file 20190323o0722.leftslategray.v0.png
 *
 * @id 20190315°0336
 * @type String
 */
Sldgr.Cnst.sData_Btn_Cross_SlateGray = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MDGgsKH1+yBDkAAALRSURBVHja'
            + '7Z3LcdRQFAU1TQRkw5KlszFEYDsCQzhesiQcIhhWUEXx8U9i3nvdb+XlPadbMyOXSvf04fbTeTvg'
            + '3N9cn7bO7ufj3eddeTHLoJ1jOmW2gYM/kQBJMH6HzB4g+BMIkATjdsZqgYI/sABJMF5HrB4w+AMK'
            + 'kATjdIItcPAHEiAJLt8B9gLs2akId2YqxJ2VinFnpILc2agodyYqzJ2FinNnoALdszPLw5szSjD6'
            + 'zPc31yd+/FGhPvi/fAUkgQ/+b78BksAF/48/ApPAA/+vdwFJ4ID/z9vAJFgf/qP/B0iCteE/KkAS'
            + 'rA3/SQIkwbrwnyxAEqwJ/1kCJMF68J8tgF2C1eC/SACrBCvCf7EANglWhf8qASwSrAz/1QKsLsHq'
            + '8HcRYFUJDPB3E2A1CSzwdxVgFQlM8HcXYHYJbPAPEWBWCYzwt23bTufz+b9eZZ2xLihmHTz4EwiQ'
            + 'BON3xypBgj+wAEkwblesGiz4AwqQBON1gyVo8AcSIAnG6QJr8OAPIIBdghGyUxHuzFSIOysV485I'
            + 'BbmzUVHuTFSYOwsV585ABbpnpyLdM1Oh7lnpqtr/zPQw7FQC9KpYsQC9LFosQK+LFwvQwgixAK2M'
            + 'EQvQ0iixAK2NEwvQ4kixAK2OFQvQ8mixAK2PFwvQSyQu2wHBd0tA8N0SEHy3BATfLQHBd0tA8N0S'
            + 'EHy3BNjhz/Cc4ZEdEny3BHTluz8JCL5bAoLvloDguyUg+G4JCL5bAoLvloDguyUg+G4JCL5bAoLv'
            + 'loDguyUg+G4JCL5bAoLvloDguyUg+G4JCL5bAoLvloDguyX4uT4++Je5D7/0Ifjuud98O70N/oHn'
            + '6v27u4cvX2+H/gQIvjdHK2PkeVoaJc/V2jh5vhZHynO2Olaet+XR8tytj5fnJ/huCQi+WwKC75aA'
            + '4LslIPhuCQi+WwKC75aA4LslIPhuCQi+WwKC75bgOwFlv5ym5NdEAAAAAElFTkSuQmCC'
             ;

/**
 * This constant holds the data from file 20190323o0724.leftsteelblue.v0.png
 *
 * @id 20190315°0337
 * @type String
 */
Sldgr.Cnst.sData_Btn_Cross_SteelBlue = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MDGgsHG+1xvm0AAAK4SURBVHja'
            + '7Z07cttAEAXBPpwd6ExK7CvZgU5HR1aVyx/9QHN3ujdiOO91QyJYKMzl05dv1+MG5+nx4XJ0Tj+f'
            + 'v34/lRe7DNq5TafsNnDwNxIgCdbvkN0DBH8DAZJg3c6YFij4CwuQBOt1xPSAwV9QgCRYpxNsgYO/'
            + 'kABJcP8OsBdgz05FuDNTIe6sVIw7IxXkzkZFuTNRYe4sVJw7AxXonp1dHt7cUYLVZ356fLjw80OF'
            + '+uD/8i8gCXzwf/sOkAQu+H/8EpgEHvh/vQtIAgf8f94GJsF8+C/+DpAEs+G/KEASzIb/KgGSYC78'
            + 'VwuQBDPhv0mAJJgH/80C2CWYBv9dAlglmAj/3QLYJJgK/0MCWCSYDP/DAkyXYDr8UwSYKoEB/mkC'
            + 'TJPAAv9UAaZIYIJ/ugC7S2CDfxMBdpXACP84juNyvV7/61XWWeuCYtfBg7+BAEmwfndMCRL8hQVI'
            + 'gnW7Ymqw4C8oQBKs1w2WoMFfSIAkWKcLrMGDv4AAdglWyE5FuDNTIe6sVIw7IxXkzkZFuTNRYe4s'
            + 'VJw7AxXonp2KdM9Mhbpnpavq/LPTw7BbCdCrYsUC9LJosQC9Ll4sQAsjxAK0MkYsQEujxAK0Nk4s'
            + 'QIsjxQK0OlYsQMujxQK0Pl4sQC+RuG8HBN8tAcF3S0Dw3RIQfLcEBN8tAcF3S0Dw3RJgh7/Dc4a3'
            + '7JDguyWgK9/9l4DguyUg+G4JCL5bAoLvloDguyUg+G4JCL5bAoLvloDguyUg+G4JCL5bAoLvloDg'
            + 'uyUg+G4JCL5bAoLvloDguyUg+G4JCL5bguf18cG/z334vQ/Bd89N8N3ztzBCnqOVMfI8LY2S52pt'
            + 'nDxfiyPlOVsdK8/b8mh57tbHy/MTfLcEBN8tAcF3S0Dw3RIQfLcEBN8tAcF3S0Dw3RIQfLcEBN8t'
            + 'AcF3S/ADQES9katNG5oAAAAASUVORK5CYII='
             ;

/**
 * This constant constitutes the data from file 20190323o0723.lefttomato.v0.png
 *
 * @id 20190315°0338
 * @type String
 */
Sldgr.Cnst.sData_Btn_Cross_Tomato = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MDGgsNGmCZZnEAAAK2SURBVHja'
            + '7Z1LTuRAEAXtuBzcA47FQbidWY0Qghl+9nRVRdSKZb4X4e42spz78XB3bFecp+d965x/Hu9P5cUs'
            + 'g3au6ZTZBg7+TAIkwfAdMnuA4M8gQBIM2xmrBQr+yAIkwXAdsXrA4I8oQBIM0wm2wMEfSYAkuHkH'
            + '2AuwZ6ci3JmpEHdWKsadkQpyZ6Oi3JmoMHcWKs6dgQp0z840D2/OKMHoMz897/z5o0J98N9+BSSB'
            + 'Dv773wBJoIL/8Y/AJNDA//tdQBIo4P/7NjAJlof/+f8BkmBp+J8LkARLw/+aAEmwLPyvC5AES8L/'
            + 'ngBJsBz87wtgl2Ax+D8TwCrBgvB/LoBNgkXh/04AiwQLw/+9AKtLsDj8cwRYVQIB/PMEWE0CCfxz'
            + 'BVhFAhH88wWYXQIZ/GsEmFUCIfxt27b9OI7/e5V1hrqgmHXw4M8gQBIM3x2rBAn+yAIkwbBdsWqw'
            + '4I8oQBIM1w2WoMEfSYAkGKYLrMGDP4IAdgkGyE5FuDNTIe6sVIw7IxXkzkZFuTNRYe4sVJw7AxXo'
            + 'np2KdM9MhbpnpavqgjPRw7BzCdCrYsUC9LJosQC9Ll4sQAsjxAK0MkYsQEujxAK0Nk4sQIsjxQK0'
            + 'OlYsQMujxQK0Pl4sQC+RuGkHBN8tAcF3S0Dw3RIQfLcEBN8tAcF3S0Dw3RKghz/Dc4YXdkjw3RLQ'
            + 'le/+JCD4bgkIvlsCgu+WgOC7JSD4bgkIvlsCgu+WgOC7JSD4bgkIvlsCgu+WgOC7JSD4bgkIvlsC'
            + 'gu+WgOC7JSD4bgkIvlsCgu+W4HV9fPBvch9+60Pw3XPvx8Nd8MWfBC2MkOdoZYw8T0uj5LlaGyfP'
            + '1+JIec5Wx8rztjxanrv18fL8BN8tAcF3S0Dw3RIQfLcEBN8tAcF3S0Dw3RIQfLcEBN8tAcF3S0Dw'
            + '3RK8AGOdEhBc+0nZAAAAAElFTkSuQmCC'
             ;

/**
 * This constant holds the data from file 20190323o0715.downdarkseagreen.v0.png
 *
 * @id 20190315°0341
 * @type String
 */
Sldgr.Cnst.sData_Btn_Down_DarkSeaGreen = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MDGgsQNTQkNzQAAAJVSURBVHja'
            + '7d3BVYNQFARQsbU0RCdpyN504UI9xggEwn9v7lQQ/pm5Rk1gur5d318kNq+OILwA82WeHENm5ss8'
            + 'EcCPgM8mOIq89XsPIF8FoEDe+gkgPwtAgaz1E0B+F4ACOesngNwuAAUy1k8A+bsAFOi/fgLI/QJQ'
            + 'oPf6CSD/F4ACfddPAFlWAAr0XD8BZHkBKNBv/QSQdQWgQK/1E0DWF4ACfdZPANlWAAr0WD8BZHsB'
            + 'KFB//QSQxwpAgdrrJ4A8XgAK1F0/AWSfAlCg5voJIPsVgAL11k8A2bcAFKi1fgLI/gWgQJ31E0CO'
            + 'KQAF6pwpAQhQq7HWTwCpUgAKjH+GBCBA7QZbPwFk9AJQYNwzIwABejXa+gkgoxaAAuOdEQEI0Lvh'
            + '1k8AGa0AFBjnTAhAgKzGWz8BZJQCUOD8MyAAAbIXkH7tBCCAJSRfMwEIYBHJ10oAAlhG8jUSgAAW'
            + 'knxtBCCApSRfEwEIYDHJ10IAAlhO8jUQgAAWlPzaCUAAS0p+zQQggEUlv1YCEMDP1eT3KwQggHfX'
            + 'yb+tEIAA9TLi0qr+xZIABKiZkRZX+f8VBCBA3YywvOqfWSAAAWrnzAV2+MQSAQhQP2csscunlglA'
            + 'gB555iI7fWeBAATok2css9v3FglAgF45cqEdv7VMAAL0yxFL7XrnEgIQoGf2XGzn+xYRgAB9s8dy'
            + 'u9+7kAAE6J1HFpxw51ICEKB/tiw55e7lBCBARtYsOunZBQQgQE6WLDvt+UUEIEBW7i088ellBCBA'
            + 'Xm4tPfUJpgQgQGa+Lz75+cUECM8HPISTkVLK8GUAAAAASUVORK5CYII='
             ;

/**
 * This constant holds the data from file 20190323o0712.downslategray.v0.png
 *
 * @id 20190315°0331
 * @note Base64 encoding file 20190315°0316
 * @note Encoding was done by https://www.base64encode.org/ [ref 20190315°0313]
 * @type String [sImgSrcBut_Down_Gray]
 */
Sldgr.Cnst.sData_Btn_Down_SlateGray = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MDGgsKHMa7VYMAAAJVSURBVHja'
            + '7d3bVcJQFARQY8PYAXaAHeuHH+oSMeRB7jmzpwJy18wWFZLp5fXt/Uli8+wIwgtwOZ8mx5CZy/k0'
            + 'EcCPgM8mOIq89XsPIF8FoEDe+gkgPwtAgaz1E0B+F4ACOesngFwvAAUy1k8A+bsAFOi/fgLI7QJQ'
            + 'oPf6CSD/F4ACfddPAJlXAAr0XD8BZH4BKNBv/QSQ+wpAgV7rJ4DcXwAK9Fk/AWRZASjQY/0EkOUF'
            + 'oED99RNA1hWAArXXTwBZXwAK1F0/AWSbAlCg5voJINsVgAL11k8A2bYAFKi1fgLI9gWgQJ31E0D2'
            + 'KQAF6pwpAQhQq7HWTwCpUgAKjH+GBCBA7QZbPwFk9AJQYNwzIwABejXa+gkgoxaAAuOdEQEI0Lvh'
            + '1k8AGa0AFBjnTAhAgKzGWz8BZJQCUOD4MyAAAbIXkH7tBCCAJSRfMwEIYBHJ10oAAlhG8jUSgAAW'
            + 'knxtBCCApSRfEwEIYDHJ10IAAlhO8jUQgAAWlPzaCUAAS0p+zQQggEUlv1YCEMDP1eT3KwQggHfX'
            + 'yb+tEIAA9TLi0qr+xZIABKiZkRZX+f8VBCBA3YywvOqfWSAAAWrnyAV2+MQSAQhQP0csscunlglA'
            + 'gB555CI7fWeBAATok0css9v3FglAgF7Zc6Edv7VMAAL0yx5L7XrnEgIQoGe2XGzn+xYRgAB9s8Vy'
            + 'u9+7kAAE6J01C064cykBCNA/S5accvdyAhAgI/csOunZBQQgQE7mLDvt+UUEIEBWbi088ellBCBA'
            + 'Xq4tPfUJpgQgQGa+Lz75+cUECM8HK+y/g5FR2PcAAAAASUVORK5CYII='
             ;

/**
 * This constant holds the data from file 20190323o0714.downsteelblue.v0.png
 *
 * @id 20190315°0342
 * @type String
 */
Sldgr.Cnst.sData_Btn_Down_SteelBlue = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MDGgsHF+TH8kYAAAJXSURBVHja'
            + '7d07VgJREARQcXEmrInENZmwOg0M1CPifJnXXbdWwLxTdUWFmdPL69v7k8Tm2RGEF+B6OZ8cQ2au'
            + 'l/OJAH4EfDbBUeSt33sA+SoABfLWTwD5WQAKZK2fAPK7ABTIWT8B5HYBKJCxfgLI3wWgQP/1E0Du'
            + 'F4ACvddPAPm/ABTou34CyLQCUKDn+gkg0wtAgX7rJ4DMKwAFeq2fADK/ABTos34CyLICUKDH+gkg'
            + 'ywtAgfrrJ4CsKwAFaq+fALK+ABSou34CyDYFoEDN9RNAtisABeqtnwCybQEoUGv9BJDtC0CBOusn'
            + 'gOxTAArUOVMCEKBWY62fAFKlABQY/wwJQIDaDbZ+AsjoBaDAuGdGAAL0arT1E0BGLQAFxjsjAhCg'
            + 'd8OtnwAyWgEoMM6ZEIAAWY23fgLIKAWgwPFnQAACZC8g/doJQABLSL5mAhDAIpKvlQAEsIzkayQA'
            + 'ASwk+doIQABLSb4mAhDAYpKvhQAEsJzkayAAASwo+bUTgACWlPyaCUAAi0p+rQQggJ+rye9XCEAA'
            + '766Tf1shAAHqZcSlVf2LJQEIUDMjLa7y/ysIQIC6GWF51T+zQAAC1M6RC+zwiSUCEKB+jlhil08t'
            + 'E4AAPfLIRXb6zgIBCNAnj1hmt+8tEoAAvbLnQjt+a5kABOiXPZba9c4lBCBAz2y52M73LSIAAfpm'
            + 'i+V2v3chAQjQO2sWnHDnUgIQoH+WLDnl7uUEIEBG5iw66dkFBCBATqYsO+35RQQgQFbuLTzx6WUE'
            + 'IEBebi099QmmBCBAZr4vPvn5xQQIzwfkdMF3fyHIVwAAAABJRU5ErkJggg=='
             ;

/**
 * This constant holds the data from file 20190323o0713.downtomato.v0.png
 *
 * @id 20190315°0343
 * @type String
 */
Sldgr.Cnst.sData_Btn_Down_Tomato = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MDGgsNFIchS3YAAAJTSURBVHja'
            + '7d3dUQJRGANQsTkLsS0KoTt88IVxUPlZ4H7JSQXsneSICru74+fH8U1q8+4I2guwP+wcQ2n2hx0B'
            + '/Aj4boKj6Fu/9wByUgAK1K2fAPKjABSoWj8B5EwBKFCzfgLILwWgQMX6CSB/FIAC8esngPxTAApE'
            + 'r58AckEBKBC7fgLIhQWgQOT6CSBXFIACcesngFxZAApErZ8AckMBKBCzfgLIjQWgQMT6CSB3FIAC'
            + '49dPALmzABQYvX4CyAYFoMDY9RNANioABUaunwCyYQEoMG79BJCNC0CBUesngDygABQYs34CyIMK'
            + 'QIExZ0oAAsxqrPUTQMYUgALLnyEBCDC7wdZPAFm+ABRY9swIQICsRls/AWTZAlBguTMiAAGyG279'
            + 'BJDlCkCBZc6EAAToarz1E0CWKQAFXn4GBCBA9wLar50ABLCE5msmAAEsovlaCUAAy2i+RgIQwEKa'
            + 'r40ABLCU5msiAAEspvlaCEAAy2m+BgIQwIKaXzsBCGBJza+ZAASwqObXSgAC+Lna/H6FAATw7rr5'
            + 'txUCEGBgVlza0L9YEoAAQ7PS4gb/v4IABBicFZY3/DMLBCDA8LxygQGfWCIAAQLyiiWGfGqZAAQI'
            + 'yTMXGfSdBQIQICjPWGbY9xYJQICwPHKhgd9aJgABAvOIpYbeuYQABAjNlosNvm8RAQgQnC2WG37v'
            + 'QgIQIDz3LLjgzqUEIEBBbllyyd3LCUCAklyz6KJnFxCAAEW5ZNllzy8iAAHK8tfCC59eRgACFObc'
            + '0kufYEoAApTmdPHFzy8mQHm+AGUCq35E5pe5AAAAAElFTkSuQmCC'
             ;

/**
 * This constant holds the data from file 20190323o0725.leftdarkseagreen.v0.png
 *
 * @id 20190315°0344
 * @type String
 */
Sldgr.Cnst.sData_Btn_Left_DarkSeaGreen = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MDGgsQMqpAopcAAAGpSURBVHja'
            + '7dexDYAwEATBB9G/aIjanogSiHauBO9Ito/dHevtfu6dmbkcRTP8NwCi4QGIhwcgHh6AeHgA4uEB'
            + 'iIcHIB4egHh4AOLhAYiHByAeHoB4eADi4QGIhwcgHh6AeHgA4uEBiIcHIB4egHh4AOLhAYiHByAe'
            + 'HoB4eADi4QGIhwcgHh6AeHgA4uEBiIfPA6iHzwIQPgpA+CgA4aMAhI8CED4KQPgoAOGjAISPAhA+'
            + 'CkD4KADhowCEjwIQPgpA+CgA4aMAhI8CED4KQPgoAOGjAISPAhA+CkD4KADhowCEjwIQPgpA+CgA'
            + '4aMAhI8CED4KQPgoAOHbOx1Be8fuugIA8AgEwG8AABAAAAEAEAAAAQAQAAABABAAAAEAEAAAAQAQ'
            + 'AAABABAAAAEAEAAAAQAQAAABABAAAAEAEAAAAQAQAAABABAAAAEAEAAAAQAQAAABABAAAAEAEAAA'
            + 'AQAQAAABABAAAAEAEAAAAQAQAAABABAAAAEAEAAAAQAQAABhAbDfIQAQhwBAHAIAcQgAxCEAEIcA'
            + 'QBwCAHEIAMQhABCHAEAcAgBxCC97JCvBkal9PQAAAABJRU5ErkJggg=='
             ;

/**
 * This constant holds the data from file 20190323o0722.leftslategray.v0.png
 *
 * @id 20190315°0333
 * @note Base64 encoding file 20190315°0317
 * @type String
 */
Sldgr.Cnst.sData_Btn_Left_SlateGray = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MDGgsKIZ7TGZIAAAG5SURBVHja'
            + '7dcxEQJBEEXBXcAAUnFwSEAOISFyUDBESCB6/SXM66q92zOzrLfb/TFrrXVximb43wCIhgcgHh6A'
            + 'eHgA4uEBiIcHIB4egHh4AOLhAYiHByAeHoB4eADi4QGIhwcgHh6AeHgA4uEBiIcHIB4egHh4AOLh'
            + 'AYiHByAeHoB4eADi4QGIhwcgHh6AeHgA4uEBiIcHIB4+D6AePgtA+CgA4aMAhI8CED4KQPgoAOGj'
            + 'AISPAhA+CkD4KADhowCEjwIQPgpA+CgA4aMAhI8CED4KQPgoAOGjAISPAhA+CkD4KADhowCEjwIQ'
            + 'PgpA+CgA4aMAhI8CED4KQPgoAOGbO3/2dZ6v9+EUzZ2coL09M54AAHwEAuBvAAAQAAABABAAAAEA'
            + 'EAAAAQAQAAABABAAAAEAEAAAAQAQAAABABAAAAEAEAAAAQAQAAABABAAAAEAEAAAAQAQAAABABAA'
            + 'AAEAEAAAAQAQAAABABAAAAEAEAAAAQAQAAABABAAAAEAEAAAAQAQAAABABAAAAEAEAAAYQCwv0MA'
            + 'IA4BgDgEAOIQAIhDACAOAYA4BADiEACIQwAgDgGAOAQA4hC+mUoBXTFVKIIAAAAASUVORK5CYII='
             ;

/**
 * This constant holds the data from file 20190323o0724.leftsteelblue.v0.png
 *
 * @id 20190315°0345
 * @type String
 */
Sldgr.Cnst.sData_Btn_Left_SteelBlue = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MDGgsHHp0bSuIAAAGrSURBVHja'
            + '7dfBDYQwEATBBZHbBXYxEd/yIgReXROCuyTbx+6O9fb73zszczmKZvh3AETDAxAPD0A8PADx8ADE'
            + 'wwMQDw9APDwA8fAAxMMDEA8PQDw8APHwAMTDAxAPD0A8PADx8ADEwwMQDw9APDwA8fAAxMMDEA8P'
            + 'QDw8APHwAMTDAxAPD0A8PADx8ADEwwMQD58HUA+fBSB8FIDwUQDCRwEIHwUgfBSA8FEAwkcBCB8F'
            + 'IHwUgPBRAMJHAQgfBSB8FIDwUQDCRwEIHwUgfBSA8FEAwkcBCB8FIHwUgPBRAMJHAQgfBSB8FIDw'
            + 'UQDCRwEIHwUgfBSA8FEAwrd3OoL2jt11BQDgEQiA3wAAIAAAAgAgAAACACAAAAIAIAAAAgAgAAAC'
            + 'ACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAg'
            + 'AAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAMICYJ9DACAOAYA4BADiEACIQwAg'
            + 'DgGAOAQA4hAAiEMAIA4BgDgEAOIQHsdF/RDWBtLHAAAAAElFTkSuQmCC'
             ;

/**
 * This constant holds the data from file 20190323o0723.lefttomato.v0.png
 *
 * @id 20190315°0346
 * @type String
 */
Sldgr.Cnst.sData_Btn_Left_Tomato = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+MDGgsNFmkvKloAAAGtSURBVHja'
            + '7dfBEYMwEATBg3JuJg/IP4XzyyHwmt4QNF1IHLs7Ftxz7czMx0k0w/8HQDQ8APHwAMTDAxAPD0A8'
            + 'PADx8ADEwwMQDw9APDwA8fAAxMMDEA8PQDw8APHwAMTDAxAPD0A8PADx8ADEwwMQDw9APDwA8fAA'
            + 'xMMDEA8PQDw8APHwAMTDAxAPD0A8PADx8ADEw3cBCB8FIHwUgPBRAMJHAQgfBSB8FIDwUQDCRwEI'
            + 'HwUgfBSA8FEAwkcBCB8FIHwUgPBRAMJHAQgfBSB8FIDwUQDCRwEIHwUgfBSA8FEAwkcBCB8FIHwU'
            + 'gPBRAMJHAQgfBSB8csfeX+HDOx1B/Quw6woAwCMQAH8DAIAAAAgAgAAACACAAAAIAIAAAAgAgAAA'
            + 'CACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgA'
            + 'gAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIC4C9DgGAOAQA4hAAiEMAIA4B'
            + 'gDgEAOIQAIhDACAOAYA4BADiEACIQ/gBTJ6VXcO+vvsAAAAASUVORK5CYII='
             ;

/**
 * This ~constant tells the path for dummy image one
 *
 * @todo : Not yet used. It is intended as initial background
 * @id 20190107°0331
 */
Sldgr.Cnst.sDefault_DummyImageOne = 'docs/img1/20090504o2215.grainydummy180sq.v0.x0360y0360q66.jpg';

/**
 * This ~constant tells the path for dummy image three
 *
 * @todo : Not yet used. It is intended as initial background
 * @id 20190107°0335
 */
Sldgr.Cnst.sDefault_DummyImageThree = 'docs/img1/20130304o1422.grainydummy480prt.v0.x0270y0360q66.jpg';

/**
 * This ~constant tells the path for dummy image two
 *
 * @todo : Not yet used. It is intended as initial background
 * @id 20190107°0333
 */
Sldgr.Cnst.sDefault_DummyImageTwo = 'docs/img1/20130304o1421.grainydummy640ls.v0.x0360y0270q66.jpg';

/**
 * This constant embeds file 20190104o2153.drawarrowback1.v0.x0048y0048.png.b64
 *
 * @id 20190315°0443
 * @type String
 */
Sldgr.Cnst.sImgSrc_DrawArrowBack1 = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+MBFhEBDBlfVlIAABBPSURBVGje'
            + '1VpZbFxVmv7OdrcqV5Vdi2MnTiZOcNKBdGcgJJFRt9IRjTSBkcImTQuNRi0E0rxFIoM0D0g9Uj80'
            + 'g1rNNL2BNE8EEJFYNCDUIagRWaQ4JEAmwcFksx3bsctLuVLb3c4581B1K+WyA2LphznSUdVd6p7/'
            + '+9fvP7eA/+eDfR8Pef3110kQBHznzp04e/YsAaABkMakAMj27dute+65x9q0aRPfsmULstmsHhsb'
            + '+85rk2/7wyeeeIKkUik899xzsCwreeDAgb25XPdO0zR+kEwmN2qtNaWU6PpQxWLxYrlcPnrlypX8'
            + '4cOHPwBQ3rVrl5qYmPAopX6xWJSffPLJ3x7Ajh07yNDQEAYGBuK/+MUv/nX9+vX/HIvF73AcG2Eo'
            + 'YRhCa61BKdWtazDGiNb1U6VSSRcKhdMnT5787/fee+/I4OBgrVarFTnn3qFDh+T3DuDJJ5/Eiy++'
            + 'iMXFRXR2dsZ/+9vf/tvGjRv/PRaLCc/zldaaAIRQSkApg2FwMMZACAEh9SV0XXoCAEoprZTSlFK6'
            + 'sLAwdeLEiec/+OCDdzds2FAoFos3fN/3XnrpJblp06bvJwYeeOAB9tOf/lRblrV///79R/r6+vZQ'
            + 'SgmljAAgvh8Sw7CgNSCEgJQShmGAcwbGGCilYIwRxprHhDFGCCGwLCu2ZcuW++64445/uHTp0nXP'
            + '826Ypin/8pe/SEqpnJ+f/24AHn30UTY0NNT561//+q9btmx5XAhBKKWEcwYpFfH9AMlkCj093bBt'
            + 'E+l0FxYXS7AsA5RSUEqbliCENM+1AAMAkkgkUnfeeec+13Xp2NjYlGEYoRBC9vf3h6Ojo98OwIED'
            + 'B5gQYuPjjz8+nkqlejnnRAgBITjRGsT3A2QyWWgdghANQgi0ZiiXS7BtuylkJGjkVhGoxjUS3QcA'
            + 't9122w7Hcfo/++yz4XQ6HZZKJX/Xrl3h8PDwNwPw1FNPsYWFhW379u07bVkWsW2b2rYN0zSJlBqu'
            + '60EIgVQqCUIA0zRAKQPnHNVqFY5jQwi+RNuEkCUg2qxDIhB9fX3r+/v7f3zs2LHTXV1dfrlc9vfs'
            + '2ROslKVWBPDSSy/R6enpHz700ENnTNOkqVSKZDIZkkqlEIvFoZRGJpOBaRpQSkIIDiEECAE4N1Eu'
            + 'lxGPO2CsDigS/BYWaAVDKKWEEIKurq7ObDZ7+6lTpz6Px+O1+fl5d+/evcGpU6e+GsAzzzxDfvWr'
            + 'XyWefvrpi7Ztk66uLpLL5UhXVxccxwHnAo7jQGsFpRQYq2tYCAHGGAzDRKVSgeM4EIKDc76i30ef'
            + 'rYAa8QBKKbTW6OnpWUUpzV66dOmiaZrlqakpb926dUtiYhmAo0eP4g9/+MOruVzu9s7OTtrd3U1S'
            + 'qRQ4F6CUwrIs2LYFpWQTAKWs6S5CmCiVSojFHLRknWWaX8kCkfDRNaWUXrt2bf/nn38+73neLGOs'
            + '5Pu+NzY2ppYBePLJJ7F582axZ8+eH+7ateu/HMdBNpsl6XS66QaccwAaWgNaKwRBAKC+mGGIBhAD'
            + 'xeINxGI2OGdLsk9rNmo/HwkfAYksopTCunXrNr3//vtnLcu6YZpmaXBw0D979uxSAGfOnMG5c+fU'
            + '/v37DyUSiTWdnZ00k8nAMIyGkDdNTAgQhgGkrBfNyIXqRczEwkIBiURsSTFrB3ErQNHUWjdjIh6P'
            + 'W9Vqlc/MzIwLIQqVSqX25ZdfhgDAIwDPP/88vXbt2mA2m/2xEAKGYUIIAa0Bw+DQWkNrBUIIlFJQ'
            + 'SjdcRkBrDcMwEAQSlUoVrltrZqmIPkRavVmQdeOZACH1z/rQzd8oVf8ehlLv3r17z/Hjx4/H47Ep'
            + 'pXQRgA9ALaESr7322oVMJjOQTCZJMpkkuVw3bNuCEAYA3RQ+CAJUq1WEYRhpCo7joFqtYWxsAhMT'
            + 'k+jo6IAQHErppotEJLUueCToTcpUryVRQFMopaC1hpQhwlDhnXfeOnLt2sRBKcMTlmVNvvHGGy4H'
            + 'gMcee4xVq9UtXV1dmwmhulqtEcY4enrqrlEXvi5ABCBynZvaUqCUwHEsrF3bh+7ubliWDSnDppBK'
            + 'KRCyJG1GPKlhIQ2lNIIgQBiGUEpBSgkppVZK4yc/2X337373/IednZ3dtVptfnBw0OMAkM1m9YYN'
            + 'Gx5hjMH3A1IqlZFIJOG6LmzbaqQ1IAxDBEHQEJYucY8wDMEYQ0/PKpA6tQMAcM6a2pey7vucCwgh'
            + 'mtfqj6lbR8oQlUoZYeiBseY1olSoV6/uTSWTiY2EkC8ZY2OxWKzMAODkyZP65z//p99JqXPFYpmk'
            + 'UkmsWbMGnDfTGaSUTeHbeQ0haIISQsA0jUZ6JY1MBBDCYBgGHMeBbVvNzNZeA6QMIWXYdKO6lQgM'
            + 'gxHGBC5fvlKZn5+7qrWeSqVSpSiIKWOia3Hxhu7r6yOJRBxKhVBKwHXdZVV0+aBNjUdAW4eU9WrN'
            + 'GG9aLpqRMpRSKJfLqFQqLcEOSFmPA8a4ljIkvb2rV4+MXEgzxlOFQmGK7t69mzqO3eW63irDEEgm'
            + 'O9DREW9qPvLF1tzcqrX2Kts6IyENw4BtOzBNY0mPEI0orqSUTUXUFVXvLyI6DkB3d3enw1AmCCEd'
            + 'QgjBN2/eTHzf68pkMiyd7tSOYzcXatVQVMiixVvzdftsvSeqEfV6grYMVBfU9324rgspJRijzfs4'
            + 'p5ASDY4lQAgDQLnWuoNS2qG1Fty2bfajH92VsW0Ltm03hLxZZFo1e1MzN/N6+4gAaK1hmmYTdBQ7'
            + '7ffU06SElBE1YUuSQ7RmnXNREovFHEA7SimHMSZ4pVKBaRokHo/DMIyvLPft2m8FobVuulp0nnPe'
            + 'DM7oWrtwYRhCSrnM2tHzIoVFyUDKAIRQS2tthGHIeBAEhBAw3/cbwSaWaH8lQK2CR5/RYtFx9NtI'
            + '8EiQVteRUiIMw2YKbrVoqytGiULrej+ttWaEEKa1pjSfz6uzZ8/mq9UaajV3mWu0C7pkR6DtvlaL'
            + '3eq+9hFZoN2y7cWO0jqBLJVKLqVUaq0VAE2TyaQaH794Y3Jyyr9y5SqKxRvw/WBFbUffWx/8Veyy'
            + 'sb1yy1iJqMLXbZy0rlWtViUAn1IaGIYh6eXLl+XU1MKCZRmTtVoN5XIF5XJpSepcSYvtC9+KVd7K'
            + 'alFxXNlCrQqLUm19Z2ZhYb7GGKtqrathGAZ8aGgI999/v3Dd2olVq3rXj46O6kwmS2KxjkaHZTRz'
            + 'ertm23N5VDUjWtAuV2ugRm7Syli1Vi1pNqIfkZU04VxgZGRkgXNeAVAOgiCgABCPx/WFCxc+WLUq'
            + 'h97eHlIoFDA1dR2FwiKCIFii7a8y+U3mKJupsXW2kLPmsVK6cb4+b36XTeHDMIDrejqfn9GFQmEB'
            + '0ItSyqLjOAEHgHK5HBw9evSTBx98UCcSHdBak6mpKdQrcxKmaTbT4S09lRD4vodLl65gfn4Rvb09'
            + 'sO36duPye5fARqtOWrVfp94qal/Jxx+fqWit5pTSc4Zh3Jibm/M5APi+H1iWNTsyMvL+XXfddV9d'
            + 'YI5r1yZQq9WwadNt6OjogOM4KxasCEAQSFy9Oo5z584hl+uGZZnLLFZvYJYCiehD9NnaG9fdU0LK'
            + 'EMePH81bljULIE8pvZHL5eoW+Pjjj9XevXtrb7/99vNbt269j1KqOzuTsCyD5PNzqFSqoJTBNM1l'
            + 'Add6zDnDqlU55PM53HHHD5BIJJYRuwhP1F+0Zpmo2anHCZpVulZzMTLyhT8/Pz9lmuakEGIGQGVg'
            + 'YEByACgUCnj44Ydrk5OTw1evXh3avHnzTq01idrE4eEvkE6nsXXr7TBNA5ZlrRjQjDF0dnahqyuF'
            + '7u5coxn6JvvMS62qlILneaAUeP/9wzO2bU8AGKeU5j3Pqz377LOaRlp0HCfcsGFD+Ze//OX+YrFY'
            + 'auwm6+7uLFav7sHiYgH5fB4LC4vwfX8JbbiZRXTDZ/WKvn+rNNzaWkbPbTBU7Xkejh07Xr1+/fqo'
            + '1voSIWQUwMLw8LCPxtsTAMDBgwdVoVCoDAwMzL788sv/IYQgjdSmYzEH6XQGFy9eRKFQaGaQduEj'
            + 'P/66gG9t8JdThps1wvM8Mjc3p998881x0zQvU0q/JIRco5SWx8fH5RIAjU0tv1KpzF29evXIhx9+'
            + '+D9CCNLYfdC5XBq5XBbXro3jwoURLCwU4HleGwjcsoDdirW2n4v83vM87fs+fv/7308IIS4ppYYZ'
            + 'YxellLPVatVt1pLWBwRBoFOpVJUxNvP666//57Fjx/5KKSVhGBIppe7o6EAul0U+PwPX9eB5HuqU'
            + 'pNUNIq1iReFW6hnate+6rnZdl/zxj3/MFwqFS1rr/2WMnQcwYRhG+ciRI+qWW4vbtm1TSqnQcZzw'
            + '5MmTXyQSid7169f31xsMDtu2iZQa4+PXUC6XkUqlAJBmg16t1jA9PY1cLtfS0GMZf2rnVlHr6bqu'
            + '9jyPvPDCC/nR0dELlNIzjLHTSqkLvu/P7Ny50929ezc++uijlQGcP38ei4uLyrZtP5VKeWfOnPky'
            + 'lUr19fX1/V29Y2IkHo/BNA3k83Po6OhAGEo4jg2AoFqtYHp6Gt3d2WYWWokmt7eikeZLpRL585//'
            + 'PDM2NnaBEPIpY+wUgM+VUteTyWTlT3/6U1P4W26vVyoVPPLII/L69et+LBZzT58+PTw5OekODAxs'
            + 'NQyDAiD15geYmJgEYwyZTBqlUhmlUhk3bpSQTneuyETbX3hwziGlhO/7OH/+vPzNb34zOjs7O8wY'
            + '+4RS+jHn/LzrupP9/f3lgwcP6m/0ku9nP/sZsW3b9n0/Z5rmQLFY3PrYY4/9y/bt27c26IUul8tk'
            + 'bm5eJ5MJ4nk+wjBEItGBTCbT2AxeaoFIeM45Gq9gyezsLF555ZWFo0ePXo3FYlcAnCOEnGOMfRGG'
            + '4dTMzEz5008/VSsF/temi4cffpiUSiXTMIw0IWRtpVLZaFnWj/bt2/ePd95510bbtmi5XNGeV4MQ'
            + 'JjFNE7FYDIbBNaU3X622MFHNOSeUUszOzup33323cPjw4QkhxARj7BIh5AsAX2itR4UQs0KI6ltv'
            + 'vaW+02vWAwcOYGhoyOjs7IxrrbNSynW1Wm09Y2zztm3b/v7uu+/+QV9fX9pxHBaPx8E5b27HRHQ5'
            + '2tWbn5+XV65cqZ04cWJuZGQkb5rmNKV0HMAogMuGYYwSQqZc1y3de++97tNPP62/txfdvb29ZMeO'
            + 'HbbWukNKmQXQB2DN4uJit2EYq23bzvT3968lhNhr1qxJMsbY7OysdF1XFotFd3p6+katVisBKMZi'
            + 'sUIYhjOEkGlK6QSAa4SQfBiGi4Zh1N55553wb/KmfsOGDRgcHOSTk5NWPB6PSSmTADJSyiznPC1l'
            + 'fdPJ8zxLay2EEIwQIimlEkBNKVUFUCSEFCils5TSea11gTFWKhaLtTAMw+PHj+tvwqC+0Yh8+YUX'
            + 'XsCrr77KMpmM4bquJYQwhRCO53kOpdRWSlmUUkEIYUopRSkNgyBwDcNwtdbVxqwxxrzZ2Vlv3bp1'
            + '8tChQ/qbyvOt/+zROnp6ejAwMMDS6TSrVCqcc86VUpRzTn3fJ5xzTQjRYRhKSqm0bTucm5uTSil5'
            + '7Ngx/V3W/j/MteaYXvKfXwAAAABJRU5ErkJggg=='
             ;

/**
 * This constant embeds file 20190104o2151.drawarrowforward1.v0.x0048y0048.png.b64
 *
 * @id 20190315°0441
 * @type String
 */
Sldgr.Cnst.sImgSrc_DrawArrowForward1 = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+MBFhEDO5PUkd8AABDgSURBVGje'
            + '1VpbbBzHlT23qqu75z1DiqQomqRJSZStyF6toZVkBgkSwQmwchYRYudLCDaBEQP7JyBaA/sRIAvk'
            + 'I9kgcHadp4H9imPA+nCAjRFYthHbejgSI8mSJVOyLdmk+OaQ8+DMcPpVVfvR08PmSA42sfOxBRRm'
            + 'pme6+p77OPfeqgH+nw/+aSzywgsvkO/7xoEDB3DlyhUCoAFQazIAtG/fPvuzn/2svWvXLmP37t3o'
            + '6enR09PTn/jZ9Nfe+O1vf5vy+Tx+9KMfwbbt3PHjxw/39fUdME3z/lwut0NrrRljpMOhKpXqB+vr'
            + '9VO3bn24fPLkydcA1A8ePKhmZ2ddxphXrVblpUuX/vYA9u/fT+fPn8fY2Fj6W9/61r+MjIx8I5VK'
            + '7UmlUuGCRFprDSLSRAQApJQCY4w4Z9AaqNVqulwuXzh37tx///73v391fHy82Ww2q4ZhuCdOnJCf'
            + 'OoAnn3wSv/rVr1CpVFAoFNJPP/30v+7YsePfUqmU8DxPcc7JMAwiIhARGGMgIiilIKVCECgAoUUM'
            + 'g4MIWimlGWOsVCrNnz179ievvfbaS9u3by9Xq9U1z/PcZ599Vu7atevTiYGvfOUr/Itf/KK2bfvY'
            + 'sWPHXh0cHDzEGCPGGAkhyDAM4pzDMAxwzsEYA2MMSmlIqcAYC21DgNaAaQrinBMRwbbt1O7du7+8'
            + 'Z8+ef7x58+aC67prlmXJl19+WTLG5Orq6icD8PWvf52fP3++8IMf/OAPu3fvfkIIQaEmDbSE3yR0'
            + 'ZAHOOYJAIpvNYsuWbliWha6uAiqVKogIpinAOQfnHAAom83mH3rooSOO47Dp6el50zQDIYQcHR0N'
            + 'pqam/joAx48f50KIHU888cTtfD6/zTAMEkLAMIy21iOho/eRUIwxSBlaQAgBz2tifX0d2Wy25Voa'
            + 'pilascFbVgJ27ty5P5lMjl6+fHmyu7s7qNVq3sGDB4PJycm/DMB3vvMdXiqV9h45cuSCbduUSCRY'
            + 'IpGAZVlkGEZb8E7h4yC01mCMI5VKQGsFxgimaYIxA81mE0TUcjsCEVEEYnBwcGR0dPRzp0+fvtDV'
            + '1eXV63Xv0KFD/t1Y6q4Ann32Wba4uPjg1772tYuWZbF8Pk/d3d1UKBSQzWYhhECLadrCxmcEIvR/'
            + 'jmQyAa0lODeglIJSAQYGBtBoNKC1hhAiUggxxoiI0NXVVejp6fnMxMTEu+l0urm6uuocPnzYn5iY'
            + '+PMAvvvd79L3v//97FNPPfVBIpGgrq4u6u3tpUKhgHQ6Ddu2YZomtNZQSgHAJq0bhtEOZik1GDOQ'
            + 'yaSglGxZLAIXQCkNrXXbnVrxAMYYtNbo7+/fyhjruXnz5geWZdXn5+fd4eHhTTFxB4BTp07hZz/7'
            + '2fO9vb2fKRQKrK+vj/L5PGzbBmMMhmGAiKC1hu/7bSvEgzl0MQ4pJTjnyGRSCAIfRKwNFgBM00R/'
            + '/zasrKxuUkJEBEopPTQ0NPruu++uuq5b5JzXPM9zp6en1R0AnnzySdx3333i0KFDDx48ePA/k8kk'
            + 'enp6qLu7u23iyEcBwPf9NoC4/8dnEEgADOl0CkoFINq4P9SyQr1eRyqVbAW8hBBGlBDBOYdSCsPD'
            + 'w7teeeWVK7Ztr1mWVRsfH/euXLmyGcDFixdx9epVdezYsRO5XO6efD7Penp62prvHK7rIgiCcJG7'
            + 'CB8msrAkyuczCAKvnTc3sxfBthMQwsLqaqltGcbQjol0Om03Gg1jeXn5thCi3Gg0mu+//34AAEYk'
            + '0NNPP81mZmbGu7q6PgcAIV0KAKG7REMpDd8P4Hk+fD+AUgpEABEHUShwKBxQqzVaYHMwTROeF7RA'
            + '6BZDMQAMnuciCBR27tyB+fl5rK87SKVsMKbBOYOUpB955JFDZ86cOZPJZOaVUlUAHgDVtsDJkyf1'
            + '0aPfOCml7mKMIZFIUCaTaZtaKYUgCOC6HlZXy1hYWES5XEW1WsfaWgO1Wg1raw2srdVbs4ZyuQLX'
            + 'dZFIWEil0tBatdkrchOtFQzDgG1bMAwO3/dRr9fgugGSybb1ybZtXiwW5dra2gyA4oMPPrh+/fr1'
            + 'wACAo0eP8mazuXvPnj33McZ0KpWmrq4we5qmABCWAOHDOTKZLCzLjmmfWponaA0wFn5eWVlBrVZr'
            + '5QQFgNr5oR2EnMOyzBY1A/l8Fv392/DOO9dQrdaQSiVhGIb2fR+f//zn/2FiYuL1QqHQ12w2V8fH'
            + 'x10DAHp7e/WePXseTyQsMMbJNDkAhSDwIMQG60gZwPc9ECmEv2FtTYZDt12OSKO3t4Du7lzrXhX7'
            + 'HdrBL4SAaZotMAy2baPZbKBQyKFSqcL3PWzZ0k2GYei+vr58LpfbQUTvc86nU6lUnQPAuXPn9De/'
            + '+c3/yufzvUIIsiyrRZeA1gpSSkgpEQQSWgOchw/b4H3WkYnDKYTRokVASol4tRoJLoTYxEwhDXMI'
            + 'YSKRsDEzM48gkLAsiyzLwocffthYXV39SGs9n8/na1EQs2w220VEWkpJvu+3k0n4fqM0iPtvnJ0i'
            + 'twithXagblCiAa3VHXkD2AAnZdQKhHEXBD7uvXcYCwuLqFZrOp1O0PDw8MD169e7LcvKl8vlefbw'
            + 'ww8zAF35fH5rXAtRppUyDLxI+M10Se22YgMQteMimiEQDc55i92MNvgwjqhtASKC73vQWsGyLCQS'
            + 'FjKZFMrlCi0sLOm+vq3dUsqs1jojhBDGAw88QJzzLqUUF0LozromXqxFWTg+GIu0zNqWUKqTaTbX'
            + 'TdG1qBSJAw2ZzgUAWJYJKQPkclkUCgVcuzYJ13UNIsowxjJaa8FSqRQ/ePDAlnhGjZe3kbai13gV'
            + 'Gv+8qc27A+TG/XFg8RlZIyo/oo6OiCGRsEGkkU4nyDCsJICklDLJGBNGo9GAZSXapWy8RI4XaPFS'
            + '4m6+H7lZ/Hqny8UFjVsm+r2Usv1d9L0Qok0EuVwepVIVWmsbgBkEATdc1yXbTvK4kJ2dVfTaqbFO'
            + 'gcNSeUO4OOjoWnRPq9HfdG9nrEUjdCsflUoFtVpFA+BExLXWjAVBoN5668xy3Px3m5Ew8Wqx06Xi'
            + 'DX3cDe9moYgo4vHQCV4IASLAcRwopVEqleA4rsMYkzrMjNrwfV9duHBhjYg8IhKdD4kLGQnVqfm4'
            + 'cJFQcY3H6bQzmXVaIGI3rQlBEKDZdLC0VMTc3AI4N0CkJQCPMeYbhiHZxMSEBFAqlUpzkaBx3/y4'
            + 'B3dqPO5y8UCNirv42p2g4u4YBrwAEcFxHDiOi9XVEtLplB4dHcbq6mqTMbautV4PgsA3pqam8Oij'
            + 'j4qFhYWzAwMDI1prTeHu1MeyStxHN3+nN201RWtIGcBx3E2W6dR+xHjhdQ3HcVCvr+Pq1WvIZDLo'
            + '7+8jxghXr14tCSEaAOq+7/sMALq7u/WlS5deay1OGwGlNvnn5inbtLcxOz/LFrNs7gHijBQPWsMw'
            + 'oJRGvd7AwsISpqdvI5/PYceOEdi2pcvlsq5UKiWtdUVKWU0mk74BAI7j+G+88calr371iA7LBqO1'
            + '38NgmlartjHaPe1GBkY7825qtHnow8ViEY7TxOjovejr64Pv++0mKM77Uf0DEDzPhdaE27dvI5NJ'
            + 'o79/K0zTRL1ep8nJyYaUcoVzvmKa5trKyopnAEC5vOanUnbxjTfeeGVkZPTLnrfR64baicqBO+kz'
            + 'uhZm3yj4w9fl5RXYto0tW7rR19d3R9KLx4tSCs1mEzMzc1haWkIiYWN09F6YpgnXdaGUwptvvrmc'
            + 'TCaLSqllxthab29vaIE//emcOnz4cPOPf3zrJw8//PCXiUgbBgfnnDg3YBgCjFEMTDxAgTgerXVb'
            + 'sA8+uAnX9ZDL5TbFTuSW0Q6dlKHwSukoYDEwMAAhTARBAM/z8N5773kLCwvzlmXNCSGWADTGxsZk'
            + 'ywJlPPbYY82ZmZnJYnH5/P33339AKdXe7zRNc5MPxwXZXLBtDvStW/tQra4hkUjewV5RJap1yPOV'
            + 'ShWTkzdg2xYGBgaQSiWhlEQQBPB9Hy+++OJSIpGYBXCbMbbsum7zhz/8oWbRwslkMti5c2f9e9/7'
            + '3rFKpVLTWmullO4M3g1mkXewSHxoreF5QZsMOnNLCECj0VjH6uoqZmcXkEqlsHPnDiSTSSil4PuB'
            + '9jwPZ86cWV9cXJzSWt8koikApcnJSQ/tlgrAc889pyqVSmNsbKz461//+t+FENTyTR0EwV2TVTz1'
            + 'd2baUDEAY/wOv49czPN8AMCNGzeglMS2bVtbm2ZhcLuuSysrK/rFF1+8bVnWLcbY+0Q0wxir3759'
            + 'W24C0NrU8hqNxspHH3306uuvv/4/QoiIUrWU8o6apbNw6wzweI8QH1JKrK83MT09g8uXL8OyLIyO'
            + 'DiGbzcSF157n4ac//emsEOKmUmqSc/6BlLK4vr7utHuI+MK+7+t8Pr/OOV964YUX/uP06dN/YIxR'
            + 'EAQkpdRRtdip6buVEJEFou4sXtA5TsgqYXnAMDw8CNO02gpyHEc7jkM///nPl8vl8k2t9Tuc82sA'
            + 'Zk3TrL/66qvqY7cW9+7dq5RSQTKZDM6dO3cjm81uGxkZGd3Yx2mdVHRk6btdK5XK0FpjaGgIQoQb'
            + 'u67rYnFxEZcvXwXnhKGhQWQymTaVOo6jXdelZ555Znlqauo6Y+wi5/yCUuq653lLBw4ccL7whS/g'
            + 'zTffvDuAa9euoVKpqEQi4eXzeffixYvv5/P5wcHBwXtbzQb9uTopfr1crkJrYHh4CJxzNJtNVCpr'
            + 'mJ2dg2UJbN8+gkQiEe2DwnEcXavV6Je//OXS9PT0dSJ6m3M+AeBdpdRCLpdr/OIXv2gL/7Hb641G'
            + 'A48//rhcWFjwUqmUc+HChcm5uTlnbGzsAdM0mVKK7tYXdIJpNpvwfR/5fB6cc3ieh3feuQIhDPT3'
            + '9yOdTkEIASklPM/DtWvX5I9//OOpYrE4yTm/xBj7k2EY1xzHmRsdHa0/99xz+i865PvSl75EiUQi'
            + '4Xler2VZY9Vq9YGjR4/+8759+x5o7ZlqwzCIMaajA4p4LFSrNZRKJSglYZompJQwTYHBwSFYlonW'
            + 'ESwVi0X85je/KZ06deqjVCr1IYCrRHSVc34jCIL5paWl+ttvv606q+T/0ynlY489RrVazTJNs5uI'
            + 'hhqNxg7btv/uyJEj//TQQw/tyGazrHXi2HavVqxoKSU5jov19XV4ngvODeTzOZ1Op4lzjmKxqF96'
            + '6aXyyZMnZ4UQs5zzm0R0A8ANrfWUEKIohFj/7W9/qz7RMevx48dx/vx5s1AopLXWPVLK4WazOcI5'
            + 'v2/v3r1/v2/fvvuHh4e70+k0j3w6SnSGYbQ2xQJIKVEqleStW7eaZ8+eXXnvvfeWLctaZIzdBjAF'
            + '4JZpmlNENO84Tu2RRx5xnnrqKf2pHXRv27aN9u/fn9BaZ6SUPQAGAdxTqVT6LMsasG17y+jo6BAR'
            + 'Je65554c55wXi0XpOI6sVqvO4uLiWrPZrAGoplKpchAES0S0yBibBTBDRMtBEFRM02z+7ne/C/4m'
            + 'J/Xbt2/H+Pi4MTc3Z6fT6ZSUMgdgi5SyxzCMbilllogyruvaWmshhOBEJBljEkBTKbUOoEpEZcZY'
            + 'kTG2qrUuc85r1Wq1GQRBcObMGf03+6tBFEjPPPMMnn/+eb5lyxbTcRxbCGEJIZKu6yYZYwmllM0Y'
            + 'E0TElVKKMRb4vu+Ypulorddbs8k5d4vFojs8PCxPnDih/1J5/uo/e8RHf38/xsbGeHd3N280GoZh'
            + 'GIZSihmGwTzPI8MwNBHpIAgkY0wmEolgZWVFKqXk6dOn9Sd59v8CubRMHzrzIw8AAAAASUVORK5C'
            + 'YII='
             ;

/**
 * This constant embeds file 20190104o2141.kdeinfo1.v0.x0048y0048.png.b64
 *
 * @id 20190315°0435
 * @type String
 */
Sldgr.Cnst.sImgSrc_KdeInfo1 = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB+MBCg4KG3TNBjQAABMDSURBVGje'
            + '1ZprjF3Xdd9/a+99zn3MnZk7D3LI4Uuk+JJkMbRlPUzDrkzbjSsrTyX9kKBI0TQ2igati6pO86Et'
            + 'WiBo3X5J7CJKBLQoasVIFaAqrAKO4ySyHq5FSSZNmSIpURSfM0Ny3nfmPs45e+/VD+fMUEKctq4V'
            + 'FL3AwZ1zB3efvdb6P9be+8L/5y95Pwb5/K//F7k+8wd2W6sd/9NX/zMB4rvGFoDjn/hwzQ7ttdb5'
            + '2DRSrC4s+D974QX9fxbAjl/72zK5dTenf+tfcffo0OhDn3/8kfqWbQ+SJHfVRtr7Y4yqICKigsZi'
            + 'tXPBZ+svdC6/fevyn3/jT6nr+vS9H4mrc9czj8lldTU8d/LkX30An/7oA7Lzqye49uih1u5f/Dt/'
            + 'r717/99yjdYHTL1OLIfTCCCi5RtijMU6JyJgVck6qzpYWXxt7vvf/Q9Xv/3fvrX9Qx/vF4P+asu5'
            + '7A+ffjq87wHc97nP8drv/z6jvznH1L+Zbn38X3/ln9Sm7/xNbQwlPi+ic1ZckogRMMZgjSAiGEAR'
            + '8iJQFIXGiIgRrBUNiibOmnxlcbbz/Zd+e+Y73/zvo3fsX+53VjtZlmdPPvlkOHTo0P92bvb/JICf'
            + '++yj9tHjn9DHjrW/cPff/cffslt2HY/GiIgVmybiXCLWGpx1iLFgDIjBJglRhaw7oLvSlbw7QFSw'
            + 'aSJJmopYi601hlr77v7rwweO/I31q2/PkQ06tXotfOMbfxyMMWFxcfHHC+Anf/YX7cq5V8c+9fi/'
            + '+3O7565f7WPFY0Wcw1gn1lqMMeWkja0wYzHWknklZjnDWrAjiUw3Hc1EiGrQJEGShCiGPCKxMdIe'
            + 'PXzfz+IHpnft8mxST32SJGHfvn3+8uXL/3cB/NI//KfWOrd/+tFfu1o0x6bVOXFpSpIkYq0TMRap'
            + 'Jm+qzItsfGbJ+wX1UHDnsOP+6WEObG8xXEsYFJG+SSjSGiJWStgZVITGzgMP0Bja13nr+2dbY+N+'
            + 'fW0tf+ihh/zZs2d/tAB+9df/kc1WV45u+8TPvzawNanXG2Z4qMlQvSbWOZCNrAtINXljUTFEY4nG'
            + '0pDIzppwaLzJ3q3DDDUb1JOySh0cK5qgAoJgxAhiUIXa1t172zvv/NjSyedfGxodz7vd9fz48ePF'
            + 'yR+iUj80gC/8xhNmabB8ZOJjP/c9b2tmarwth6cn5PBUm93jLRpJQj8oHlCxYCxRLGotKpZCDV4c'
            + 'k6nh4Fid/ZMtRkZauDSl5hzBWG6GhBu5wWAwYhAMghEREUUwQ+NjdnTins75E2/Uh4b7i4uLg0ce'
            + 'eaR45ZVX/tcBPPIz/0wufP23Rg7/ym9ciElddk6OyX13TMnhbaNMt4cYb9YYrid0vbKaRwJCEIMa'
            + 'ixpHNJbCOAoxtBspu9p1dozUaNXTEiZYbgbL5b5wqzAYESwlfEQEKD9DlfqWndusdVv619+8kKb1'
            + '9dnZ2WzPnj3v4cRfCODCmy/wmX/xxNd0ZOs9U+Nt88G9U3JwapTRZo2ataSuJO1aHrnVC2QKQRxe'
            + 'HF4sobqiWIK1uCRlpJ4yljpyFS704PUOXOkqfQ+IQZESkspmNcCgIWhtYte+tctnF2MxmHfWruV5'
            + 'nl25ciX+hQDu+9zneOCuw8nRY588MnL4I79TbzS4Z/cWuWd6nJFGQs1u6Dt4Feb7ntn1nEE0FBii'
            + 'OIKYEkoVITuFoVMoiCWKYWYgvL7sObPiWc4VYwRVARUipfRGFaRqMIyx+BhpTO09tPjan5y2aa1T'
            + 'q9XWjh07lp8+fRoAtxHAa08+iUDx+S//0ZejsWFspGX3TIwyXHckpjIlETSWjc7AQ6GWQhWvQkRQ'
            + 'EVBTWrFAwLBUGM6sCTNZJIbAfC+wlAFqkNK4iYBRJSJYKYO3AmJEjKtRn9zVHj/6iZ/uXjy16Jxb'
            + 'XlxczIDBewL4zD/4HfM385ljvj75sYZ1jA81aDdTrAiCgCiqildlLQ8sDJRBMBQKXhUVi0ZQQEwJ'
            + 'C6eKD4FL8xlvK1jrSKyQiGAwFFExKFG1BI0KihIVokCiAWNAw0BHj3zy+NLpF1+KQ81ZjboK5EDc'
            + 'hNDFE3+sx375C98cmNr40NAQ28eGZfdEi0Ziyuwr5ArdXLm4kvPmUsZKDkWkhM5GhVTAOIx1+Aj9'
            + 'Xsb6yhr5YIBLUpK0BlW20bKaKKCCVtBRLQmtuiGxCLZm87X5ELuda9Ywf+TIkd65c+e8A/j4J3/Z'
            + 'jjQHd2tj7LDiNEYk85FeFhiuWdQIMSrrQbnSKTi3kLHYj2ReybWEi256gSHPPVnWR3tr1P2A3SHD'
            + 'pDXWsh6FcThnykZMS2gGLROkWmbfbhBbBdQj4jTEnPG7/9r9V998+bnmyPhUv99fPHbsWOYA7rpn'
            + 'q2bjB34h4AArRYTFbsE7S33EWhqJ0C+Ua2sFZxcyrnUK+kHJg5SZB8QIqoqIUPT7DJaWaA46TA8L'
            + '92ytE2s1Tq8UzPYHmGYDRCBGtMxxyYRYtn+q5dxRQwkuJ2KdpuPb226ovT+qvGWtvTI0NLRuAb53'
            + '4mU9+pO/9GWftLZGMWIqQ1ovIst9z41uwcXlgvOLOXPrnvVcyYLgo4JJwCYUQel2utyau4VZucXe'
            + 'es5Hd9T4yJ5R7t81ylizRoyw7A2ZJBRRsFpONkYtZbOqQlkdbr9rREASY+nOvdP13YVLqM622+21'
            + 'DRIbaq3xoKKqRnKvdAcBT8bqIBBNwiAa+lHIopCrEAUUS/CRkBdokVMbdJgcLHF3O3L/HeN89NAU'
            + 'W8dGqDm4uthn0Vsu5sLKQMgjWFPyQBS8KBLBUEp10AqbYkAtgqqPuTS33LFjZfbsRLS19vLy8qw7'
            + '8PDDZvTkt8dNfXQbRQQLUYV+EfAIUgjeCAWOAoOnmryAcYa1lQ7rq8vUYs7RqZT77pjg/p0tWkMN'
            + 'tk20SWopoh6RQWluqqXMVopFJRBS3Ud91yJFSp5EhKgiIaJufOeEhjBinA4nSZK4n9hyWDoP2HHv'
            + 'g41iVdSgUQgRCEIIkWCFKBFvDEGVKAJGKAphLBHuGAlMNwyHpoc5sH2U7VuHGHJCWkvLRk89fQ9z'
            + 'mWEhV2IECaV8ahWBbCiOghcwahADXmPFkspjTOqiMJwYM6yqiaulDds+8OHJ0s5tpSjlF0Kk7G8i'
            + 'eFMGpmKIWq4bsxg5NFbnI5Pb2T1qWQmO788rl1fXeWibsC+1kNSBQBYi85lhOd+QHNAoFWmrnCtE'
            + 'MZioKFomESGKEFQAETM01pSozRBD01mXuK50cTkCUpbVSFlOKyhCiEo0QoxSyqmWlAkqRI0ESfBJ'
            + 'g2ve8tZSwVs31jjY8nxwsgFG0ahIVNZzuLEOSz2hnSqipQNvYKVCPBJjCU8thUqkDMQihGDQqKhQ'
            + 'F5XUe29dlmTiGLHOOXJflUlNtTFS4j1qhc/A7SAETIS5deX5mdKZl3oZtUGPD7cN9TQF6/CFhyKw'
            + 'PFDWB5AXirrS3fU9JKDyANBASRIjUBoZQQUbhRhFKeOxKMbYeR+7l1+6VclK2TZsVCOWWhy1qoBC'
            + 'DGVWiYpQZnZ2LXKrq8QALRdpp5A6W1YqRlb6noVeIPOUml+NXUoom/fE8r4ank2T2fwskq3ODwQJ'
            + 'qtXsxkfyOHvm5Y4zklulnNxGWdWUDwilcoSqSYlRiKEkXl5E1vpKXkSGnWHfiOWOdkKznpYBBGVm'
            + 'XbnWgcIrSZVcDeW4BCXGMikxKtFXKhUE9dWztbJrH9FBJwiSG2OKNE2DaV28ETo3WYq95RlrKxLH'
            + 'yg2rHqU0GUGjVBnb+H9ZNUOpLAAjNUO7YUmcBYSgyspAWM4MeQAbYzlhvZ1prTJPrPqgWD2TqiJR'
            + 'CTFqVMWvzPbV2Z6q9rz3hfndEy/ywcc+m+Sr899xNhGNqqJaQeg2XDTG6n6j3FJyIoIEyAYFFAXT'
            + 'Iyl7Jps0UlfBW5npCpdWoJ+DRdFQQTGUSdEoEMp+i6jEGNEQqwRWqIhl9oqZ15eMSbrAelEUhQEI'
            + 'fkK7M6//qbMGI1bYzH45UdWy1Jtlj7dhQCzVKuYZLuRMDKUMD7cw1gJKiMpCT7nVg9yXxlR1B7cT'
            + 'VPFKY8U9pfSIWDZFGpRYFOrXVzT2l5dQXQkhrDabzTKAIh0UnQvfOWmKvoqqbhC64kmJv4recBuv'
            + 'aCy9IoIJBU3JaDcdJqlVohgZ5MpyN7LSL2XQipQV0Nvk3fh7o+psJkmIIZY88V7yG2d7qF8QdCFN'
            + '087CwkJeBrDSKcT6+d7N839SSxKkkgPZACHlMk82QbsBYIheiUEZSwLTQ4HRhgEsqlBkBbOrnuWe'
            + 'EvJAkWX4PN9UMn3XeFqNqVrxbKOx0wixgODJ3vn2LZM058WYW8aYztatW8sKvPrqy7E5erg/f+q/'
            + '/rbTAqOqUl5IZfNsDirvkb0qQTRrMNEUGlWvD0onU272IlkwECOD3jqDXpfgw224vEtSoRxbtBLz'
            + 'qBACFDlh/q1c12ZniX7GGHMT6B48eDAYgOXlZZJ00I8Ls2f90qUTtbSGgEgIZSViRDQilauWFSjl'
            + 'NHgIBWxpWPaOO4YbJXlFhLlOwekrq7x5ZY5idZYRXWLM5TjKzjNukDhU5A1x0xg0aPlcXxB9Tn7u'
            + 'mZvGNa6LMVeNMbeyLOt/6UtfUrPxsHqt6Rs77ly/8vV//gWy5TVTiaTZrEJ5USkUWkJsQ+ZG64ap'
            + '4ZRGUq22BLr9wI3FdRYX52iEefaNRvaMOWpSKtiGCUOJd6rso4JRRWJQfI6/8lKPtbnLRvRtEbkM'
            + 'LJ09ezYvm5rq9dRTT8W1leVuc9uh+YWXv/ov686KIWLUq4kFUgFT4sYiA0QVXwS8j0y0UvZsGWK4'
            + 'kWx2OD5GxprKo/eO8feP7+FnPrSdfVMjOCv4oO9y9TIRglTPiEgo0Lwn2p3XcP6Zq8bVLooxb4nI'
            + 'NWPM+tWrV8N7AgB48YUX8qzfXYgrl761/s5zX0+dFUvAEtURMEQMEVHFbBI5IBqYaNWZGmvhErfp'
            + '5FMjlgf2jfHZD+3jwbsO0G5vpx/qFFEIvhyHyltMpd1GI1YLxPeVMKB49d9fF+vehnjWWnshhDDf'
            + '6/UG5S7eu7ZVAIqi0NHRdm99fe3myvf+6N8qSau+68HjqgVBVROJojHBisGrQbAYhZoIE82UVrNe'
            + '9UyKMbB/+wjNep03bijPvZFxY81zacFTFJBUWx0iihFwCBI9RgL4vuL74k8+ecvmK28bY18XY88A'
            + '19M0XX/22WfjX7q1ePTo0eh99DZt+sH1V8+bxsh0vb1jn8ZAVEHLJr7s3VUJQXEWjmyvcfd0rVwm'
            + 'Aiu9yOxy5Adzkefe7POt833evJGxvB5IRElMJDFQd9BMoG4DTjwUXaXoSzz5e7ds9+o5xHzPWPta'
            + 'jPFcnuc3H3zwwcHDDz/M888//8MDOHPmDCsrK3FoqJE3Wu2sP3PqLVMf2VVr77hDY8CY8vBrg9RF'
            + 'UIwok8OWXeOOoZqhlyunr2c8c2qdb76xzoWbOaqB1EbqNpJapZkKY03DRNMw1oR6EolFX8OgI/7U'
            + 'f7xpu9fOCXLKWvsK8EaMcW50dLT7xBNPbE7+L91e73a7PPbYL4S5ubncJc1BMXv6bNGZHTQm994b'
            + 'xBlikI1zPKmEPCsisysFF+czXrvc53+83eWVS12uLGVkmSc1EUeknigjdWFLy7Bt2DA5LKTiKbI+'
            + '69fPhP6J371sB4tnxdiT1plXnXNnBoPBzL59+9afeuop/ZEO+T796U9Lo9FoFEW+VZLaQd/r3Dv0'
            + 'gcd+xWw7em8wKUGNBpxEjBZBxKvgK3TK5kHf7eWitdCqGyZaCVtGHMMpCirztxZ457tPLw0uffeS'
            + 'rTffEfiBiPzAWnveez978+bN9VOnTsWNfacf6ZTysccek7W1tVotTSeCyu6Qd/dj6z+RHvjMT5mp'
            + 'D+wPtmWiqmZByKKV3Gt55CSiqRMxppRdRalbw3BddLyVSKthCd1FnTn1zeWF89++7py7box9G+S8'
            + 'COdV9XKSJPNJkvSeeeaZ+GMdsz7++OOcOHEibY+NtaLqlhDCnlhkexFz2G65+4PJtiN3MTw9EZMh'
            + 'i60R1BJDJGgsV34CTjwWT8N3gnSu9ntXX1no3XrnVlJLb4iYq8Bl4GKappdFZHYwGKx96lOfGnzx'
            + 'i1/U9+2ge3p6Wh544IGGqg6HELbEyK4g7NT+6hQu3SG2PqnDu3Yr0qA5NYp1NvYWgwl5IO8MtDff'
            + 'IWRrgq6aZGgZ9TdF5IYx5jpwTURuee9X0jTtP/vss/6v5KT+zjvv5NixY25mZqbearWGQgijwKQP'
            + 'YYuInYA4ojCsoairkhhjrGKCEUJU6QvaE2FVRJaNMfPGmEVVXbbWrq2urva99/6ll17S9/Wk/t2v'
            + 'DSJ95Stf4Wtf+5qdnJxMB4NBPUmSWpIkzSzLmsaYRoyxboxJRMTGGKMxxhdFMUjTdKCqverqW2uz'
            + '+fn5bM+ePeHpp5/+kX/88b78WmX79u0cPHjQTkxM2G6365xzLsZonHMmz3NxzqmIqPc+GGNCo9Hw'
            + 'CwsLIcYYXnzxxR/rFyv/E3oPXTcTtdyEAAAAAElFTkSuQmCC'
             ;

/**
 * This constant embeds file 20190104o2142.kdeinfo2.v1.x0048y0048.png.b64
 *
 * @id 20190315°0437
 * @type String
 */
Sldgr.Cnst.sImgSrc_KdeInfo2 = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB+MBCg07JAawkuIAABG4SURBVGje'
            + 'vZpJjGXndd9/53zfve++oV5NXdXV7HmSSQtNMoAt0TES0UEEGBkMJJsAAbLONjtrZbe8ogFvHAOB'
            + 'V4EXRpwAdoA4iSTEgEwqUUzStNQtUhS7RfVUbPZQ1dVV9eb7DceL+6rYLaUR0qFzgYd6har73TP/'
            + '/+ecC39Ll5m9yv+HSz6PQ1LKr+WcvqKqr5gZKkLKCQzAwCBZJmdQFZxzqOqbwBvOua8B5JxR1b99'
            + 'BQ4eFGJ8TVW/Yim9MhoO7f2bd2Tz8T7394bsRcPMMEBEUGDZK+c2Vqhy5Pkzp2h3O/iiNO+9eO/f'
            + 'VNVvqerXP6sin1mB6XTyYllWV8ejoX3nynvy3taA+6OI77Sb40TIAkhztALiHM55EEOTEUb7rHu4'
            + 'dKTLz589QbvXp9PpWOG9qOrlz6LIp1IgxIh37ktm9ruT0fCV//H9H/Lt23vEsk2KAe8crihQAVXF'
            + 'qRxa3hDqkAghkDOICs4JGRBRemHMLx8puHTuJP2lZdrtthVFIar6kqr+4PNRIITf9KqXv/ndv+Qb'
            + 'N3dIZQcjIeob686FdqqN5QUEwXtHjpnx3oDx7pDU7uEWFmh5qCRiKpAyGaE7fsQ/eK7L8+fP0V9c'
            + 'pN1u472/qqov/z8pEEK4OhoOLv3+n70t1yeeAKjzFIXincc7RUUQFVQVAUQVVaGOiZiUSbUIKpAN'
            + 'McOkeXSVJxRxRp0yKSaIgS+Xu/zSF86xdnSdXq9nZVm+65x76W+kQIzx6v2t7Uu/9d/fkVR0sMLN'
            + 'Le5QFUQaQWVufVFBaX4XVaaDMePeEcTyPCeaiuQlE8yBQJVn+BzJKZFiJOfMieFd/vGl0xx77jj9'
            + 'ft+qqnob+HXn3BufWoEY49XbdzYv/d53P5RBdrSqina7hXNKMAgpkznI20aRJukEVEEVjYE97SAY'
            + 'ZoKXTCERxQjmqM3TIuJzRMxIKZFjJGdYHd3j1y6ucuLUKZaXl6mq6k3n3C99KgVSSlfu3L334u/8'
            + '+TVJ6lld7nP6SJ8jvQpV4cFwxq3dMcMQSdZUHhNBnSII0QScA4NgzWMcmZaEw0cGc9Q4WpbwGJIN'
            + 'yxnLkZQyxMzS4xv8k58/ypmz51leXqbVan3dOXf5SVn9T1mdGPOL4+Hwpd/79g/BdzixusiLp9Y4'
            + 'sdyh0yrI2TjSq6lRbjwek1Imza1u4kCEgJJFkNRYO4tQSPwZe4kZST3ODNOMiMyVTeQc2V05z+sf'
            + 'XOcf+gLnHEtLS7+RczYz+7pz7mcV8N5jlq/++2+8w0Qqji71een0OhfX+3RaHkUwwEQ50g1sDiJT'
            + 'i2SUJIo1VZ8siolSEHFitGWGPSV8A3IAkQJIOFHU0jwMFXGKhZo71Rm+//41ylZFURTinLvsnPsm'
            + '8PZTCoQYCSH85q3Nu/aDXZF2t+L8xjLn1xZZqDyFNgIkMwrn8N6DKlkKokHGkZEGukQwhCxCMEdJ'
            + 'RMQ+CVFTAk0SJ7ShGoAXRSzjSKDgihYpZd6bbbBx8wbdbpeyLGm326+mlN52znEIdV71S63CX/7j'
            + 'tz8ULQqW+z1Or34ivM5pgZmQEaaxieNgjmieaEpCSabELCSDIAVgJG1Rm2ecW9RWMLUCzKhpE00I'
            + 'OKIptTmieKL4JhzVob5F6m3w3r0BH9+7x3A4JKX02wchpJ9YxX732s1N3t3KqHhWum2WOiVOBGmQ'
            + 'CTMjmjGoE9tTY5p0roCQcKSsxAzZlGyOQEmNp85GxIEYU3OIwIBF6qzze5rEj1mJuTkziCfjUC0A'
            + '2KxOs3nrFtvb20ynU4sxXnkqhJzwyh/97+tkCpwvKL1H53zGzDCD2mBcG5v7gfujyCQpMVsT/w1z'
            + 'a36aEoJDkuGdMbFAVcAoFkz9AppTA3imZAw1Gs/OQU5ND/PdqaC+xNorfPjgGhsPt1hdXZWqql7K'
            + 'OX9ZAeo6vHbr9qbdGTSVJGeYxcx4lgjJCBlm0RjUmVv7gR9tz3g0ycyiUWdIGVJ2JPPE7Bk+yrQm'
            + 'ARkO2Ho4pFPO8aGOhGlNzja/R7AspPknZAiRxgvJkbInmWLiyQbbrVM8/HiT3d1d6rom5/yqB3BO'
            + 'v/L9mw9EXAE4QoZHo8CNnQniHO1CmARjcxB4f3vG5n5gkow6NaQsI2QDdRlEeX5ZudBP3H0w4H/d'
            + '2+OjYoUvHO8gRMJoSpB2g8w5YwjSFFvI2iR7406wg8rmUecJnVXub11jZ+cxa2trVFX1mgdQlVe+'
            + 'd2OblNpkZ9Qxszuq+eD+PtujQNXyDINwb5R4NE2MglGbEM0QV4AKOSZyEgoiJ5dLLq0XnCsrdnb3'
            + 'ubE/5FGrZPWIBxKP68golZQGmaZ3UFFKEjoPxTivTJIVLOO0oGz1eDiGx7s7TCYT+v0+3sy+nELN'
            + 'MBckFDOljsZomojM2JsmshZMszLJwiwLtTWc31CyQU75ENbNFVwZKMsd5XRvkV95Hs7vjHnr9j1u'
            + 'DvqcP7fIzhTq2MQ3BmJQuqaDi8lwTpCm7LG7ryy2HYoRc81IF9jb3WU4HLGyEvAhxl8d7j1mmFpY'
            + 'zqCQTZiERESQIEQVAp6AEpkLL2CFYtYI75zDO4+ZMUowRnnjo8jffa7Pz6136OUJ3/zxA96/Foi9'
            + 'NaQoGlZqUIg1ECngCzmILiYDYzZTpjNlsQ2LwLRcYTy8z2QyJqWEx4zRtKauY1N7TeeJBSTBcqYW'
            + 'YX8GRQtwkBXECSpNf+u0qcnRIOamfPynG4HferHDpA5cPNpHwhrOO97dmnJt5y4sLiHdVWKCiFFV'
            + 'TZ4N9jLTcePNTimoNgC4OynotByCZzyZMJ1OiTHiY0yMZpk6WUOXhYaYIewMlcGsIibHaldZ8YbG'
            + 'ESaJWhynV5Y5s1pSR2NnMOZYMeOlFUfIhonweC9yYbVF4ZSzx9d5bnWB1Q/uw092uTneA98B6VDP'
            + 'jNlE+P1/tsZG3x0i9p/+cMwfvDNgHDIqsBcqeq0+08GU6XTaeMAwLKcGZTOYCpJhWBf0fJ9fONfi'
            + '7Jqj42Z0i5ochLIoQTwLncRyN9JvGZUIg0kB2lCMftvTK4XCKVJWFCb0exWvXDDaanzn9pAPJzts'
            + '+Qy5xX/4FxustJ/ugX/tix3GIfMH7wwBY5TbdHOmDjUxxrkCZmQD5z1mgpliJixVLb76xS5/73yb'
            + 'k6sOyxUxBIYzw/mSdqug5d0ccIwcI/1FxTmh6cUb8DvgRgcxvrHcZn9tkbsT5fq9DqV0mewnVjvu'
            + 'EDRlDqDv3a/5xgfjJlHmbCBnaZqflDAzvFNloVK8OKI1vWw2Yb1X8svnK04fKTEMcS0K12L1CSuZ'
            + 'ZZpmS1BfNLzEEiEkYjIKAV8CKTGrM6NpZFwnHszgUXCMrEXOkOd8IM9nSgfXlY9rHg7zIQ1Xy9ho'
            + 'B+ccIs3gwDtVWmVB5ZUwzUQMUQg5MKpTgycHQs4PTzkznASUTLsA74U6GINpYm+SCSnRcRkFQjYe'
            + 'jDOD0NyHZa49hh+NCkJyiBmoMJxluuXT/cLOOD1hLOjaGOoRvlVQFAWqivdFQX9xiUV3nZFrH9B1'
            + 'tvZnfO/WjGOLJd1SqUphMgtsPppyf2/GJBqmjtt7mUKF/dDU7ZXKCDEyS4lJVqwo+GjXcbItfO9h'
            + 'TTYYhRbDun3IsSoV/tUfb/Mn/3Ltia7B+I9XRiy0FCdGoYkyzHDjh7SWOrRaLbz3eJEmZM4sOR5u'
            + 'FcxCw91Dinzn+oDdKfz9ix1ePlVy//GAN95/xA/ujvl4VvFY+00PkOHBJHO0zMSJYxKaOG6Ixgwn'
            + '8F2D5TVlWAulyidxPbfu7sh45d/dA2uoe6HQrxSH4SXjc8BSohpu0um8QFVVDfaY2bdE9PLPHWvz'
            + 'zrag4jBrqMrWaMJ/uWI45yi9EqOjWzmGo31+dH/ExsnlpmEHFgJMozSo6uWJlrtp6F0pTAOoNV1d'
            + 'MxFoarzkBhjbTnHz2xTDciOIZSPHQBzt0S0y3W6PTqfTeEBV36rrmtMby/grD1Er5o06lC7jXOBP'
            + 'rwzYGiX+zomKF04eYzSZcuPhbWajPXy7T6ppZkMmDS94qn0UCgf7KrgkeDUszeem9kl8H34/aD7n'
            + '48lMxllT5dzOdRb7Pfr9BbrdLocdmaq+ubS8xPmFAWVRNK7PGQy6Jfgy8O1rE/7kypgHQ+WF4yt8'
            + '9dIxVt2YGI2cn3jo/+Fa6in1NBFmM2Jdk1NjXcsGuWGfZs13M2kebU1JxTLkgMVI5/FVllePsry8'
            + 'fOgBpWkV/02r1eFXvniEwgJKM0FrPhkHLFSRO49n/NkHY/7qnmfEMriFhtcbn4zSkcPQOJxom2Ap'
            + 'MR0PmI6HpJiw3OSOHXzm4xfLICaNA7JBShBq9PGHrLQSq6tLLC0tUVUVqvqv5/2AeyuEwKnjz3Gq'
            + '/T43puuMQ0JSAlFEmlrccol37034ybYynBXUVpKbhmAu+tPJeXA92o8sFx5YQQiINXGf5+UZy4jO'
            + 'cWDuSUsgZCQFcqjp3ftz1s8dZ3298UBZlqjq1UNUUtWr7W7P/vkvrNK2AW4ei2pPesPIOfFoHJkl'
            + 'm7eF1vyvPHtWJod/NAxHio4UGqPYgbPmHhFrqK6aITlBrNF7b3K0pxx/7hhHjx6l1+sdgNlberC0'
            + 'cM693Gq1ZHltg6+eGlKqomTUIpoDMg9MyVAIOGmEJ9sTU55nLpyeSmqReQ+cDvJg7o1mcoDkxvJW'
            + 'j2G8xZHdv+DEydMcP3GCtbW1g8n1iznnwyQ+GGxd7S8s2MtfvMALnTvN/IeEI+NJjUJkxAydCy/z'
            + 'ppBnKvF0XtiBwk8aIDdlEzPUMs4CEidYnLJ484947sQpTp86yfHjzbDXe39VRN5VVZ6if865l6uq'
            + 'kqXlFf7RL57mnLvxyYG5prAazRFHBEuN8Icx8CwlDqbSQtVTqgXXJGlTZhAyKhmP4XNArYYwgnpE'
            + '7/ofcvJIjwvnznL6zBmOHDlCu90W7/3LOeen50JP7L8udzodO7pxjH/6i89xsXUHb5HCZmgOOJvh'
            + 'LOAsQm4qlj1l6Z+OnEZ4BCb7idmoKTveEqVmOt7ol8ZCEen4iI9DqEcsfPiHnF2BCxe/wPnz5zl2'
            + '7Bi9Xs+895efXD89czpd1/VLu7u7bN65xX/9y4/5cHaCYErUkmCelJsp3CgXZF/N0Qjm24tPAO0A'
            + '1s0QS+SUaCm0y4YFd0uh9EZMkcFgxHh/l/aN/8zZVeXC+Qs8/8LznGmsb+12+2eWHfLs1Wm6XNf1'
            + 'b+w+3pW7dzf5i6s/5u2do4ylTzAlUZDFMQ3CTCui7zR5cSj4U9GDhBkuB8pC6LUcK13HSsfRrYS6'
            + 'DuwOxzy69UM6H32LE8fWOH/+AhcvXuTMmTOsrKzQbrff8t6/8pk2NCmlq3VdX9rb25O7H3/MzZ/8'
            + 'mP95I3M7nQDfIpmS8GSUOitD66CtNpYzeTZu1k8KLgckG85Br1JWewVrfc9C2YTY1sNtHv7gv7Fc'
            + 'b3L89FnOnjnDmTNnOHnyJCsrK1RV9fp8e/nGZ96RpZSuhBBeGgwGbG1tc/fuJjdv3uavHrR4ICeI'
            + 'rks2qJMwTY5ZzKCKU6X0TXcm1iBA5ZR+JSz3CnptRxrtsHvtddzj62wc2+D48ROcPHmSkydPsr6+'
            + 'ztLSEmVZPlP4T72lzDm/GGO8OplM2N/f58HDh9z/+C6bH93l5nbgXlhl360QtIP4imQOy5lkGcFh'
            + 'gJOIJ9K1Aa3JXfzudaq8z9r6OuvrR9nY2ODYsWNsbGwchAxlWb4JfO1Zwn9qBVJKiMiXcs7/NoTw'
            + 'pclkIvv7+2xtbbG1/YjH2w/Y3tlhMJxwfyTUs8jQemRRZLaLJ1Eypa0z2qWj1+vRX1plabHPysoK'
            + 'a2trHDlyhKWlJbrdrrVarc93T/xT3ngtpfSVEMIr0+mU8WjE/mDA491dBoMB49GI8WRCXU+JIWLZ'
            + 'UOdwzlGUJVWrRbfbZWFhgcXFRfr9Pr1e73DB7Zy76px7+XPd1D8rrHLOV2OM1HVNCIG6rplOp9R1'
            + 'TV03ow+bA533Hu89VVVRliWtVouyLCnL5n0J59z/dan9eSuAqmJmX845/6qZvZpzfjWlRM6ZnDNm'
            + 'Rs75cIKgqs2rCM3bKq+LyOuq2lbVr/1N5fhrcCe6ywSRArAAAAAASUVORK5CYII='
             ;

/**
 * This constant embeds file 20190104o2131.kdeleft1.v0.x0048y0048.png.b64
 *
 * @id 20190315°0423
 * @type String
 */
Sldgr.Cnst.sImgSrc_KdeLeft1 = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAUwwAAFMMBFXBNQgAAAAd0SU1FB+MBCg4WA4HWwz8AABAJSURBVGje'
            + '1VpbbBzXef7+c85cdmaXuyS1FElRlBxRUujKlm04hlvVEBwLtpM4cfLgPvQhQIA+uwWSJrFfbBgO'
            + 'EjmQ3gwETRA/qlbgqmiMWlYtC3IgQ6AYx45EyTbFO0UuSWm597mec/rAnc3yIl/itGgHGOzOcHjm'
            + '///v/7//chb4f37QF11Aaw2itWUOHjyI/fv3cyklc12XPM8DEYGIsLy8rIIgUO+++676P6PAiRMn'
            + 'MDIywnO5nHzuueeS233PPvvsIABSSjGlFDjndOzYscUwDBcByIMHD/LHH3+c3nzzzbBcLsdTU1P/'
            + '+wrMzs7S4OCg/va3vz34yCOPPOG67t/39PQMpVKpvJSSJagkn5xz5XneSrFYLBcKhX974403Tp89'
            + 'e/byY489JokomJmZCa5du6b/xxQ4fPgwzp8/j6985St06dIl/cwzz3zjgQceeCmdTt9pGAbiOFaJ'
            + 'O3HOqXm0PE0pBSLSRATDMJiUEktLS1Pvvvvuv/zqV7/610ceecQvl8vl0dHRsFKpyL+4AkeOHGFv'
            + 'vfWW+v73v//4Pffc89KOHTvuCsNQMcZICNEuuG4Xvk0JANAASGutpZRaa02WZdHKysrSyZMnXxgb'
            + 'G/uvoaGh0ujoaMWyrGB8fBxxHH+iXPyzCP/888/Tr3/9a/bLX/7yPw4ePPiC67rbAJAQggzDICEE'
            + 'cc6Jcw4iIsYYbnMSYwycc3DOGRGRUkqbppm6//77nxgcHPzr06dPv3fXXXepOI5DxpgslUr6CyGg'
            + 'tcbTTz/9N4cPH/73zs7ObqVUIiAJIcAYQ7u1k+utEEi+a63blteklNJSSjDGUCwWi0ePHv1H13Xf'
            + 'C8OwUCqVKqOjo/LPUkBrjR//+MdfPXLkyFmllLIsi4QQm9wEQMvKyT3GWEvodoXa105OAFBKoamI'
            + 'jqIIr7zyyvOLi4unpZRT09PTpfHx8bidsj9VgSeeeIKGh4ePfP3rXz+jlFKu65LjOGRZFuI4hu/7'
            + 'kFJCa90SvN36nHNIqcAYgXG25v0bFGj/niiglKIoirSUkn7xi1+8UC6X/7Ner1+vVqulS5cuyc8U'
            + 'A0ePHiUAw9/85jcvEpHq7u6mnp4e6u7uhuu6cBwHRNQSIvFrIQQ45zAMgWrdx42lIjw/RMZ1YZkG'
            + '2Jrvt57fiBJjjJL1tNY4ePDgobNnz36cyWRWATTq9XpYr9f1Jyrwve99Dz//+c/xwx/+8A+u67o9'
            + 'PT1s+/btyGazZNs2TNNE4vtBELSsndzjnKHhR5icK6Bws4zVUh2GKZBxHViWuSmwE0XaUWSMJevR'
            + 'gQMHHjh16tTve3p6GoODg43V1dWwXq/fXoH3338fx44dOz40NPRoNpul7du3U0dHBxmGsSlAwzBs'
            + 'uRDnHIJzeEGEmRvLWCjcAucCxAVK5QoEF8hm3E0Ct1m/PfApYbNsNusQUXZ6enoqiqKK67qN+fn5'
            + 'liux5MtTTz2FF154gXK5nL1///5/YIypjo4OpNNpJDy/sfZpo0QYQqBU9TA5W8DUXAGm7TZjgCEI'
            + 'JaRWYJyDaL2lkzXakUzQFEJASqmPHDny1TiO7zJNc1cul0vff//9tAmBq1ev4ty5c3j55ZeP9/X1'
            + 'PeQ4DvL5PLmu2/LVxF+11gjDEGEYtpSpeSEmZhdRKNwCGRb8Rh2McURxiL5tnRja3Y+0a2/JTBvR'
            + 'aDuJiIhzDtd18x988MHHpmneCoKgNj8/H7cUeO655/Doo4+yMAy3P/nkkycZY8p1Xerq6oJlWdSu'
            + 'gNYaUkr4vo8oWsuSnh9iYmYR0zeWoUAwTHPtOaUw2JvH8P5dyGUzgN5a+ATV9vuc80RZLaVEX19f'
            + 'z4ULF2YZY8uc89X+/n5vdnZWcwA4f/483n77bf2jH/3o2d7e3oc452TbNjKZDFmWtY7ylFLwfR9B'
            + 'EAJaYaVYweTcIiZmF+GmO6CkhIwiEBF29edx577d6OxIr0Nwq9ywEeWN8dA0nnv58uWrlmUtG4ZR'
            + 'n5iYiFl7APf09PxdFEUqqVmCIEAURa2/J5b3PA9KxijXPczcKGBxqQjTtFCvVteU1Arbt+Ww70sD'
            + '6EinNnH+ukTUjIcNdLrOtYQQAKCHh4eHwjDcqbXOCyFs0zRJAMB3v/tdfuXKlcFcLrcHgAJAUkrU'
            + 'ajUwxmCaa/QXRRHCMIRSErWGj/GpeczMLYMbBoQQCJQPKTW+NNCHu4a/hJRtAtBIZG5ZWetWXqPE'
            + 'WkSA1kCbazV7CWitIYRAX1+f5bruHZzzvjiOZx5++OGKaLoF+853vtPffAEjIh1FEYVhiHK53EpQ'
            + 'CazF1Som5xcxNbuEdEcW9WoZUikIIZDvymLnjh7YloEgjCBVAujtqxkCQWOtrCANEEPrnVLKZnI0'
            + 'iIgwPDw8dP369TyAzMrKyopoUqgaGxt7wLIsRGv+S4nLoMk6Cd/X6h6mbhSwuFyEaVmoVcrQAIQG'
            + 'DM6QSTuo1hqo1OrQIGilQaRvowIlBgdhDQGpNRgRerfl0JFxW0GeoJfP53vGxsY6LMty8/m8KQDg'
            + '4sWL1NHRYbXXNUQEpRSYUgDjkEphtVLD7MJNzM0vA0KAEaCaLiKlBEBYKZZQLFXgB0Gz0uJbFlwa'
            + 'wFrh0NIARIQoDMEYwXVsZDvSLYZKcobruo7WugNAOooizgDgpz/9adzT0/O3Ukqd4L2OmxkhDGMs'
            + 'Lq9ibmEZ6WwOSsYIfB9aSUBpaNKQSqPux6iHChICUgtITYi3OKUmRIoQK6zdU4RYAk6mCyk3h0bD'
            + 'a8VGm0H1rl27srVazVZKOZZlrYV30wxxEybayAJrSqz5pSE44jheC0wCtCIwRm1lsQQkAKU+U7u3'
            + 'JiRrRgEQRwFAbK2KJfpTgP9JGcY5t7XWNmOMJwqwZoe0FQ+DiGBbFvrynQiiCDNzSxDCAOMWGrW1'
            + 'woo0g+CEXDoFzjk83weSdTR9amObvE+GPsA0bHvHutKlPTtrrQVjTEgp12j0vvvu457nLQkhSKn1'
            + 'Y5sEDc4YunIZpFIWOGeYv7GCII5hGAakkuBMQAigK5tBd2cHiBOU0pt4/5M6K42ESQnZjLOudEmS'
            + '2vT0tO84TvI4BAB87Wtf48Vi8ZphGAiCoNVttVeIiSXSTgp7BvrAiGF8Yh4pJ416vQIwjShSKJZr'
            + '6O/dhoG+bsSxglTy881JNEBsvVu2tZ/wfT8molApFTmOowQArK6ukpTy9+1Zd+OR0JnWGrlsGvst'
            + 'A9DA+OQ8ODdgWhaq1QqK5Qqm5wtIuzayGReMbW4nP+ukr73d1HrNDycnJ6umaXqMsYZSSjKtNaan'
            + 'p6Pjx4/PMcbirdL+Vv2sY5vYd8cO3LG7D6ZgCIMAhhDg3MDMwjL+8MdxLBdL6/JIew/8uYZXRK02'
            + 'dnZ2dhVAQ2vdKJVKMSMifPzxx1EYhgsLCwsfGYZxW4utE0ADrmtjz84+7Nq5HVJGcBwXWisQMRSK'
            + 'ZVz9cBa3Vqv4rABsZf0EASmlXlpakvV6vUhEq3EcV2zbDhkAXL9+HYcOHeITExNvO45DuvnfSbO9'
            + 'kQ10UrNooLszgy/v2Yk79+5Cw6tDayCVcgEQFlaKuHxtEoWV8rpMvBUKt0O+reHHyMhIxTTNlTiO'
            + 'bzqOU5menv5TNdrb2ytff/311+r1+jrBN1l+w7VSGinbxNDufuwZ7IMlCGEYQEkJLjiWbpUw9tEU'
            + 'bhWr66rOrdzkdqjEcax936eRkZEl27ZXhBArnud5e/fula2OLAgCVCqVxoEDBw709/fv1VrrZJKW'
            + 'tH1b5YikjrEtA7ZpQmrg5q0SUmkXcRzBTjkoV+uwTY5cNn1bJRKE263fdB34vo/R0VFvdHT0Y875'
            + 'H5RSlwEsnT59Omgh8PTTT8f33ntvcPLkyZc550nk6+bnJhSSlyWCKKWxrbMDf7V3F+7cO4jQa8A0'
            + 'bEgl4dgCtmWhOTXZhOLGzzbm0VEUad/36bXXXpu3bXsGwEw6nV6J49hf1xOfPn0aAwMDUkrZqFar'
            + '8u677z6klGrNM9sLqtspoQEYgqMj40BKiVK1CoMIB758B3YP9EAYYl158Un0qrVGFEUUxzFeffXV'
            + '0szMzFUiek8I8V61Wp0/d+6cr7XGuo7szJkzURRF5VOnTp2YnJz8kHOutdY6juNPRGJj8LkpG3t2'
            + '78C+Owbw5aGdGOjdBmOD8FvF1sa+2/M8PTc3p8+fPz8thJjknF+PoqgwNzfnA9BEtF4BAKjVavV9'
            + '+/Yt/+QnP/lnKWUspVRJUEsp17HS7fKF1hqdHWkMD+3E0O4dsAwBrdfc7LNYPhFea03Hjh2byWQy'
            + '1wFcUUpdJ6Litm3bwtsOthYWFlQ+nw/7+/v9kydPXn7ssce+0ezS1o3+tpo6b5xeMMbWTV+3+p/2'
            + '64QuPc/TtVoNP/vZzxY8z7sK4CLn/PdKqakLFy6Up6am9KbB1rp5I+dBoVBY7u3tHf3BD37wT/V6'
            + 'PWoOXLVSCnEct17WfrRft9hmQ/PejlL7GDE5PM/T1WoVL7744lypVLrKGLvEGHsPwFQQBKv1el1+'
            + '6nD3xo0bqNVqcS6XC7PZbPC73/1u/MEHHzycSqVEEtibqHQL637S3kD7iLHZwOswDKlcLuP48eM3'
            + 'KpXKNQDvc84vEdG1KIpWxsfHg0ql8unTaaUUGo2G7u3tjWzb9gCsnjhx4uKOHTv27N69uy+KIt02'
            + 'OWsF48ZZTzu3tz+TNOycc20YBsVxrKWUdOHCheCll16a9DzvMmNshIguGYZxRSm1+MEHH/iLi4v6'
            + 'c20xzc/P6/7+/kBr7XV2dnrvvPPO5StXrpR37ty5K5fLuWrtSGJDJxXjxgBvp9s2q7een5iYUEeP'
            + 'Hl04c+bMVcdx/khEFznnlxhjH9ZqtcLIyIhXLBa/0CYfe/LJJ91Go7HdsqyhQqGw6+677z78rW99'
            + '69E9e/Z027YNKaVOtp7aB1RNy7eEJSJtmiYA0MTERHTq1KlbFy9enM1mszNa6wnO+YdKqQ/DMJx1'
            + 'XXf19ddf97/wLqVtrw1lDx06lGKMdRJRr2EYe8rl8h35fP7O++67754DBw4MDgwMdGYyGViWtS5Q'
            + 'k2FwrVbD8vJyODY2Vrtw4cLKzZs3VxzHKWitZxhjE1rrKcbYjBCioJSqMcai3/72t3+ZbdannnoK'
            + 'v/nNb7B3717e39+fchwnyznvBbCz0Wj0ep7XK6XMd3d396ZSqc6urq6M4zh2tVpFuVyOoiiKlpeX'
            + 'y5zzhmVZJdu2V5VSy1rrgmmac1LKea11MQiC6rlz5/xPmYZ9sZ36hx56CFJKYRiGzRhL27bdQURd'
            + 'nPO8UioLoCOKohRjzCIiBkAzxqRSylNKNaSUFSFEkTF2C8BqFEWVYrHYSKfTwfnz5z/Xbyn+LAXa'
            + '658HH3yQc85NAFYul7N937cNw7CllJYQwtBa82Z8xHEch6lUKvB933McJ6jVakEqlQomJyfDP+dn'
            + 'Bn+RX6u0H/feey8jIi6EYF1dXdyyLFar1YgxBsMw1NLSkuKcyyiKZKPRUB999JH+ou/8bxvn+45x'
            + 'vmCZAAAAAElFTkSuQmCC'
             ;

/**
 * This constant embeds file 20190104o2133.kderight1.v0.x0048y0048.png.b64
 *
 * @id 20190315°0427
 * @type String
 */
Sldgr.Cnst.sImgSrc_KdeRight1 = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAUwwAAFMMBFXBNQgAAAAd0SU1FB+MBCg4SNrMJwhgAABA5SURBVGje'
            + '1VpbjBzllf7O/1d1VVf1TM/9as/YeMZeE4MBEcSuF1kKFhACIXlgH/YhEtI+syuRzYUXWJQoMZH9'
            + 'hhRtouTRG0esVxuyON4Ya4KMrLHBsL7hy9zH47mYnu6e7q6uy/+ffeiudvXMGJLArnZLKnVVdVf9'
            + '5zvnfOdWDfw/3+jzPoCZQVR7zN69e7Fr1y6plBKu65LneSAiEBGWl5e17/v6vffe0/9nABw5cgTj'
            + '4+Oyra1NvfLKK/Hl/pdffnkIAGmthdYaUko6dOjQrSAIbgFQe/fulU899RT97ne/CwqFQjQ1NfW/'
            + 'D2B2dpaGhob4G9/4xtDjjz/+jOu6f9vT0zOSTqe7lVIitkr8KaXUnuet5HK5wuLi4r++/fbbx0+e'
            + 'PHnhySefVETkz8zM+FeuXOH/MQD79+/H2NgYvvzlL9PZs2f5+9///tceeeSR1zOZzL2maSKKIh27'
            + 'k5SS6lvD07TWICImIpimKZRSWFpamnrvvff++ec///m/PP7449VCoVA4d+5cUCwW1RcO4MCBA+L3'
            + 'v/+9fumll5564IEHXh8cHLwvCAIthCDDMJKCc1L4BAgAYADEzKyUYmYmy7JoZWVl6ejRo69dunTp'
            + 'P0dGRvLnzp0rWpblX79+HVEUfapc8o8R/tVXX6Vf/OIX4mc/+9m/79279zXXdbsAkGEYZJomGYZB'
            + 'UkqSUoKISAiBu+wkhICUElJKQUSkteZUKpV++OGHnxkaGvrL48ePf3DffffpKIoCIYTK5/P8uSzA'
            + 'zHjxxRf/av/+/f/W3t7eqbWOBSTDMCCEQFLb8fldLAAiAjMnHs+ktWalFIQQyOVyuYMHD/6967of'
            + 'BEGwmM/ni+fOnVN/FgBmxve+972vHDhw4KTWWluWRYZhbHATAA0tx9eagQFEYsOz4x0AtNaoA+Ew'
            + 'DPHLX/7y1Vu3bh1XSk1NT0/nr1+/HiVD9mcCeOaZZ2j37t0Hnn766RNaa+26LjmOQ5ZlIYoiVKtV'
            + 'KKXAzA1hk9oXQkIIAoOhIg3DNIC6AEnBYzAxAK01hWHISin66U9/+lqhUPiPcrl8Y21tLX/27Fn1'
            + 'R3Hg4MGDBGD3s88+e4aIdGdnJ/X09FBnZydc14XjOE2uEPt1zaUkDEPCkAIgwsrtApZyeUgp0Zpx'
            + '7vBBSgghGm5VVwDFz2Nm7N27d9/JkyevtbS0rAKolMvloFwu86cCeOGFF/CTn/wE3/nOd867ruv2'
            + '9PSI3t5eZLNZsm0bqVQKse/7vt8QyDTNOpDasWZgOVfAtckFFMpVlEoVtGRcOLYNKe8QW9aBJK0o'
            + 'hIjXoD179jxy7Nix93t6eipDQ0OV1dXVoFwu3x3Ahx9+iEOHDh0eGRl5IpvNUm9vL7W2tlIsYJKg'
            + 'QRBAa41EZIFhGAAIiyurmJhZQKgBZqDiBVAqgm2ZyLgOBBEowZN6BIstQnE0y2azDhFlp6enp8Iw'
            + 'LLquW5mfn2+4UoNZzz//PF577TVqa2uzd+3a9XdCCN3a2opMJoM4zq+vfZKCJ11ISAENRsULYZgW'
            + 'wiiE4zqYW8rh2swCllbykKbRpO1Y+4ZhNCxsGAaUUnzgwIGvRFF0XyqVGm5ra8s8/PDDtMECly9f'
            + 'xqlTp/DGG28c7u/vf8xxHHR3d5Prug1fTYbBIAgQBMEGDUpZA5W2UogihZXcKpiBwA9gmCaqlSq8'
            + 'IECLm4aVSjVZYpOdiIiklHBdt/ujjz66lkqlPvF9vzQ/Px81ALzyyit44oknRBAEvc8999xRIYR2'
            + 'XZc6OjpgWRYlATAzlFKoVquNLJn04RiQaRpoa8kADOQKa2AIpEwLihUKxTIipZG2LbhOuhZmEwoi'
            + 'AELK+JyVUujv7+85ffr0rBBiWUq5OjAw4M3OzrIEgLGxMbzzzjv83e9+9+W+vr7HpJRk2zZaWlrI'
            + 'sqymkKe1RrVaRRAEUEo1TJ+MJkQEQQKmaaCjrQU6YhTLZQR+CNaMltYsllc+QdX3IaWBbIvTBB7N'
            + 'ibCRcJjZvXDhwmXLspZN0yxPTExETdmlp6fnb8Iw1HHN4vs+wjBsfK+Ugud58DwPURQ1LSrWuUEM'
            + '2jQMjN4ziK393WBoMBjlUhGGYWB1tYSp2QXk8qX67+v31xUSP7MWGMC7d+8eCYJgKzN3G4Zhp1Ip'
            + 'kgDwrW99S0optz377LP/BIANwxD1mxqCh2GIarUK3/cbrpOI301lQ0z02B1SKRO9Xe0AgFK5gorn'
            + 'w7LTYAJWC0VEoYLr2Mg4dhPXkspgZjiOY4yNjc2aprkQRdHy9u3by0bdLcQ3v/nNgboggog4DEMK'
            + 'ggCFQgGmaYKIECkFFWmQFI2sSqJ+LASYdUOLdSPWQx3BtlMY7OuCV/ERhgpRGCIIA7Rm2zC/eBtB'
            + 'FGFk2yC29HVCCIF6+R1XuTBNk4gIu3fvHrlx40Y3gJaVlZUVox5C9aVLlx6xLAthGCL2udjHwYxI'
            + 'aSzligjDCIYhwfUYzDH96jLXf944BwASNZYSEyzLhJUyUPZCEAGV0hqElMgXy5icXYBtmehqb20q'
            + 'BpNW7u7u7rl06VKrZVlud3d3ygCAM2fOUGtrq5Wsa4gork/AUsLzQ0zNLqBc8WHbFu7wuu7vBBAS'
            + 'lWYdBNdPmDUs0wQJgucHiJQCgaCUgpASDIFbSzkIEti+tQ99Pe2QTbVVLdK5ruswcyuATBiGUgDA'
            + 'j370o6inp+evlVIc662pMCNCGIWItERndz9CBSgWiDQh0oxI185DzYiYajtqn4oJigUYBiohUPIU'
            + 'FNeW0azBzAiDAL5fQba9A4u385i/dRvlcnUDF7TWPDw8nC2VSrbW2rEsq8FUAhDVzdSI+w0Q9U9m'
            + 'hSAMoJUCoMAJwrJWIL5778EAmAisGdANPd25nwlRFEEQIA0BElSrZhnr3UlIKW1mtoUQMgYg6h1S'
            + 'E+rkcco0YaUkysVV2LZdX5/rnlIrm8F36TiYoaFgmxaEIKwWS9A+wKhFbMNMwTRNrBULGB7sxZa+'
            + 'LmQcq0Gk9dmZmQ0hhKGUIgMAHnroIel53pJhGKR189imZg2GY9sYGR5AGOlGqZyMNHfXe80FhSBo'
            + 'DZRKtTCqIoaOFEzTrClCRxge7MGXdg6jPZvZ0DPESW16errqOE4jRBgA8NWvflXmcrkrpmnC9/1G'
            + 't3WnqyKYKYmB3k4QCBAEAaqJR589NyAAlmVi+ZMCbi7dhufdqaHSTgZeuYj+/l6MDA2grdXdIHii'
            + '/US1Wo2IKNBah47jaAMAVldXSSn1fjLrrm//jE26rjj+/zGTu4rnY2puCcu386iGATKZDKRpolTM'
            + 'Y2TbAEa3b0FXRyu05qaEGJcvzEwAMDk5uZZKpTwhREVrrQQzY3p6Ojx8+PCcECJa3+qtb8zja8y8'
            + 'qcsne11mhiBCsVTB+YsTmJi+iTDSsC0bYRCCdYStgz3YuWMrOrIt0HrzIEBEjTZ2dnZ2FUCFmSv5'
            + 'fD4SRIRr166FQRAsLCwsXI2z7t20eTdAmy8MlCo+Ll+bxfziCpgIWiuk0w6UVujtymLnti1ob23Z'
            + 'QKX1BaRSipeWllS5XM4R0WoURUXbtgMBADdu3MC+ffvkxMTEO47jENfvjpvt9fVNMs2vt0rjGoB8'
            + 'sYKLH09h6uYSlAbS6TTMVArFtTxGhwfwpZ3bMdDXiWT4ShaC8XGcUMfHx4upVGoliqLbjuMUp6en'
            + '71SjfX196q233nqzXC43CZ50i83Ok0LH4AQRSmUPV67NYHphuSGI7/sgpTA80IvRewbR3pppKOPT'
            + 'OBRFEVerVRofH1+ybXvFMIwVz/O80dFR1QBw/vz5aG5u7uOrV68eT6VSFLM+3pNV4brhVKJ8YBAJ'
            + 'hErh1nIO84u34bgtUErBcV2EYYiurix2DPejI5tpRLD1Gk8qQymFIAhw/vz5SqlUWtJaLyilVgBU'
            + 'fvvb3+oGgBdffDF68MEH/aNHj74hpYyZz/XPDVaIF0u6ESe+sy0Tra0OqtUK0o6LcmkNo8MD2LNr'
            + 'OwZ7uzYl7Hq/Z2YOw5Cr1Sq9+eab87ZtzwCYyWQyK1EUVZt64uPHj2PLli1KKVVZW1tT999//776'
            + 'xIHWjzzuBiIWQhChxU3DdWwU8iUEQRX9PR24d+c2tLe6n5n+4ueEYUhRFOFXv/pVfmZm5jIRfWAY'
            + 'xgdra2vzp06dqjIzmoL4iRMnwjAMC8eOHTsyOTn5sZSSmZmjKPpUSzTHfAEiQEiB3s4O/MXoVoxs'
            + 'G8Sue7agvdVtFIefJXy9++O5uTkeGxubNgxjUkp5IwzDxbm5uWqttCJsyEKlUqm8c+fO5R/+8If/'
            + 'qJSKlFI6JrVSqikqbR5eueYeDAhJGBrowb2jW9Hb1b4pfz5NeGamQ4cOzbS0tNwAcFFrfYOIcl1d'
            + 'XcFdB1sLCwu6u7s7GBgYqB49evTCk08++bV6l9Y0+ktqPtkXb+ZaYpNsvdnUOg6XnudxqVTCj3/8'
            + '4wXP8y4DOCOlfF9rPXX69OnC1NQUbxhsNc0bpfQXFxeX+/r6zn3729/+h3K5HNYHrqy1RhRFjcWS'
            + 'W/K8AWZ9j5wgfXKwFW+e5/Ha2hp+8IMfzOXz+ctCiLNCiA8ATPm+v1oul9VnDndv3ryJUqkUtbW1'
            + 'Bdls1n/33XevP/roo/vT6bQRE3v9/H8zixDFBd/GpJecidZ7YA6CgAqFAg4fPnyzWCxeAfChlPIs'
            + 'EV0Jw3Dl+vXrfrFY/OzptNYalUqF+/r6Qtu2PQCrR44cOTM4OLhj27Zt/WEYcmJy1pQfNpKasD6f'
            + 'GIYRjyPZNE2KooiVUnT69Gn/9ddfn/Q874IQYpyIzpqmeVFrfeujjz6q3rp1i/+kV0zz8/M8MDDg'
            + 'M7PX3t7u/eEPf7hw8eLFwtatW4fb2tpcXdtibnBcMa4neJITCa03fj8xMaEPHjy4cOLEicuO4/wX'
            + 'EZ2RUp4VQnxcKpUWx8fHvVwu97le8onnnnvOrVQqvZZljSwuLg7ff//9+7/+9a8/sWPHjk7btqGU'
            + '4vjVU7IRr2u+ISwRcSqVAgCamJgIjx079smZM2dms9nsDDNPSCk/1lp/HATBrOu6q2+99Vb1c7+l'
            + 'tO3awGnfvn1pIUQ7EfWZprmjUChs7+7uvvehhx56YM+ePUNbtmxpb2lpgWVZTUSNh8GlUgnLy8vB'
            + 'pUuXSqdPn165ffv2iuM4i8w8I4SYYOYpIcSMYRiLWuuSECL8zW9+88W8Zn3++efx61//GqOjo3Jg'
            + 'YCDtOE5WStkHYGulUunzPK9PKdXd2dnZl06n2zs6Olocx7HX1tZQKBTCMAzD5eXlgpSyYllW3rbt'
            + 'Va31MjMvplKpOaXUPDPnfN9fO3XqVBWbd9hfzJv6xx57DEopwzRNWwiRsW27lYg6pJTdWussgNYw'
            + 'DNNCCItqb/dYCKG01p7WuqKUKhqGkRNCfAJgNQzDYi6Xq2QyGX9sbOxP+i/FnwUgmaQeffRRKaVM'
            + 'AbDa2trsarVqm6ZpK6UswzBMZpZ1fkRRFAXpdNqvVque4zh+qVTy0+m0Pzk5Gfw5fzP4Qv6tktwe'
            + 'fPBBQUTSMAzR0dEhLcsSpVKJ6u/Q9NLSkpZSqjAMVaVS0VevXuXPu+Z/AwJRQ9v/TW6PAAAAAElF'
            + 'TkSuQmCC'
             ;

/**
 * This constant embeds file 20190104o2137.kdestop1.v0.x0048y0048.png.b64
 *
 * @id 20190315°0433
 * @type String
 */
Sldgr.Cnst.sImgSrc_KdeStop1 = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAUwwAAFMMBFXBNQgAAAAd0SU1FB+MBCg4NGkyLoGUAAA60SURBVGje'
            + '1VpbjBRlm37e76vqqq6eZk7MMJwG/QEN/yIjxAO7YIhCftDfAybLxuyFiTfeLbuJrlFvUCNRMHBn'
            + 'YtbTJSuEZbPgiqxIUCFkQNEVBIQ5wTjMQXu6pw/Vdfi+dy+6q6mZaTyA/2a3ku6u/qq66n3ew/Me'
            + 'qoH/5xvd7AWYGUSVy3R1deH222+XSimRSqXIdV0QEYgIo6Oj2vM8ffz4cf1/BsCuXbvQ3d0tm5qa'
            + '1JYtW6Ll2S+++GInANJaC601pJS0Y8eOq77vXwWgurq65IYNG+jjjz/2c7lc2NfX978P4PLly9TZ'
            + '2ckbN27sXLt27cOpVOrv29vbFyWTyTallIisEn1KKbXrumOZTCY3PDz8bx999NHBw4cPf7t+/XpF'
            + 'RN7AwIB37tw5/osBWLNmDY4ePYq7776bTp48yS+88MKf77nnnu0NDQ1/NE0TYRjqyJ2klFTdap6m'
            + 'tQYRMRHBNE2hlMLIyEjf8ePH/+Wdd97517Vr15ZzuVzu1KlT/sTEhPrdAaxbt0588skn+plnntlw'
            + '5513bp87d+4dvu9rIQQZhhEXnOPCx0AAAAMgZmalFDMzWZZFY2NjI7t3737l7Nmz/7Vo0aLsqVOn'
            + 'JizL8i5evIgwDH9WLvlrhH/ppZfovffeE2+//fZ/dHV1vZJKpWYCIMMwyDRNMgyDpJQkpQQRkRAC'
            + '13mREAJSSkgpBRGR1poTiUTyrrvuerizs/OvDx48+NUdd9yhwzD0hRAqm83yTVmAmbF58+a/WbNm'
            + 'zb83Nze3aq0jAckwDAghENd29L2eBaJ9Zo5dnklrzUopCCGQyWQy27Zt+8dUKvWV7/vD2Wx24tSp'
            + 'U+qGADAznn/++QfWrVt3WGutLcsiwzCmuQmAmpajNSHEpM8prgRmrr0AQGuNKhAOggDvv//+S1ev'
            + 'Xj2olOrr7+/PXrx4MYxT9i8CePjhh2nJkiXrHnrooUNaa51KpchxHLIsC2EYolwuQykFZq4JHte+'
            + 'lHKa5qP9uOARmAiA1pqCIGClFL311luv5HK5/ywWi5fy+Xz25MmT6lfFwLZt2wjAkkceeeQEEenW'
            + '1lZqb2+n1tZWpFIpOI5TEyTSspQShmFE/g0pJYQQiNwsWouARscjUNV1iq7HzOjq6lp1+PDh79Pp'
            + '9DiAUrFY9IvFIv8sgKeeegpvvPEGnnvuudOpVCrV3t4uZs2ahcbGRrJtG4lEoiaU53k11zFNsyZY'
            + 'tB8XPjovYqw4ECKqrcfPE0LQ0qVL79m3b9+X7e3tpc7OztL4+LhfLBavD+Drr7/Gjh07di5atOhP'
            + 'jY2NNGvWLJoxYwZFQkU3Z2b4vg8wQ0gJKQSkYdSsIIhAQoCZIKWICQsIIatrBCGmWyJKIkIINDY2'
            + 'OkTU2N/f3xcEwUQqlSoNDg6qaQA2bdqEJ554gk6fPm0//fTTu2zbNmfOnEktLS1kmuYkBiEiKKWQ'
            + 'Gc9h9KcsXNeD6/kolMooFl2U/aCmRUMSAILnB8jmi5jIl5DLl1ByPRRLHjLZCYABy05AxOIoiq0g'
            + 'CNDZ2Xnrp59+et627axlWeNNTU3loaEhAIARAdizZw/27NnD77777vZ0Op1OJpPc0NAwSfhIS9WA'
            + 'ww9XxzA4NoFy2UUl00qQEBBQuO0P8zB/dhsMaYBZ46dcHt/3DKJUDiGEgOYQYILtpJCUP+HuO2+H'
            + 'lHJScai1pkQiASLijRs3/u3evXsHHce5ahhGEUAZAAQAbNmyBVu3bhWrV6/u6Ozs/Adm1qZpIpFI'
            + 'cJzTIwsopRAEAUplD3ayAYZpQQgT0jSRsJMoex5UyJMYSGuGW/YgDBNGwgKRCSkNNKSb4PlBxeVi'
            + 'MWCaZkQMTES49957/8pxnC4hxIJ0Oj1j9erVomaBl19+GQD0m2++ubn6Q0FErLWmiKOjTWsNz/MQ'
            + 'BAGEIORyWZRKRagwAAkJwzRgmQkYxrW8QEJACgErYSGXzwMQCFUAIoAMEylTgmh6Dokyu2VZICI8'
            + '8MAD9+/fv/9rx3H6UqlUHoAr4gHc3t7+d0EQ6KhmiQSNNqUUyuUyXNeFUgpaM3hKSom/I+L6qltE'
            + 'tMsEsGawjixEoMl0WgMSMRQAXrJkySLf9+czc5thGHYikSADAJ588kl55syZzqampoUANABSSqFQ'
            + 'KEAIgUQiUQso3/ehlAIB0MwAXUtOgghcKT3BhIqGY6xFRAAJVH8E0LWMDEHTcksNMDMMw8Ds2bOt'
            + 'VCp1q5RydhiGA/fff/+EUXUL8fjjj8+pIhdExEEQkO/7yOVyNWqMC0JEiNTPmoFqcEtUApm4dvja'
            + 'J2swa4BkzUBcKwZoEpVqrWsgqrmFiAhLlixZdOnSpTYA6bGxsTFRpVAtpbzHsqzIbBS5TBiGCIIA'
            + 'YRjWSoeqhwFEYF3Z5fgaKhaYXrTQpDoIQAUoMwg0yVrxGivuVm1tbe2e580QQqTa2toSAgBOnDhB'
            + 'RGTF65o4XcYryMoxgYiYiK75em3/hvoqnlTFRgLHq1whBFKplMPMMwA0BEEgBQC89tprYXt7+2ql'
            + 'VKTeumXx5O8Ckd6ZCASqyM6/vk1ijuxWvQ5z3eIvplBesGBBY6FQsLXWjmVZhhFTQVhFTVNZoE6q'
            + 'rwUvuKo/ZhD9ZtVXhJ4CeFLQxwBV7y2klDYz20IIGdlJVLm/jqYJdddxLRRANz7cqLFZvWP1ZSBm'
            + 'NoQQhlKKBACsWLFCuq47YhgGxX2vXmNSC8BasNEN+PxUM1yDE0+aPAUYEVF/f3/ZcRyquToAPPjg'
            + 'gzKTyZwzTbOSZ2IJZSqPx12qwt087UY3g4Sub01mZi6XyyER+VrrwLZtbQDA+Pg4KaW+jGfdqX4a'
            + 'cXKN5n4vma/nWjE61VqDuULMvb29+UQi4QohSlprJZgZ/f39wc6dO68IIcKprd5UVqgdj9HnX3pQ'
            + 'SES1Nvby5cvjAErMXMpms6EgInz//feB7/tDQ0NDF6aWz9MYowaIqz7LYEQNeiXbXle0yN2YK+fV'
            + 'EhpNc6G4IrXWUErxyMiIKhaLGSIaD8NwwrZtXwDApUuXsGrVKtnT0/Op4zjE1V9HzXa8kYkSHEAo'
            + 'u2XMbJuFltaZaGpuRXNLK5pbZ8F1fYSBgo7VEkGoUHI9NKSb0dzaisbmmWhsmYm2jtnwgiAeyZMU'
            + 'FWv40d3dPZFIJMbCMPzRcZyJ/v7+sEY5HR0d6sCBA3uLxeIkwaem/vhaOp1CZmwEXikPFbrwvRLc'
            + 'iSyaGhtgWSZELV0DlplA04wGhL4Lt1iA9ktQfhGjQ4OY0eD8bJ4Iw5DL5TJ1d3eP2LY9ZhjGmOu6'
            + '7uLFi1WtIzt9+nRIROcvXLhwcNmyZRui0V8kfHwcQkRgrbFwwRy0tzVDkgCJijsBgGlIOEkLpiHB'
            + 'leoQLc1pdC35A4IwRKX4rFSuoQqRStqQQk4K3MjSSin4vo/Tp0+XCoXCiGVZQ8w8BqD04Ycf6hqA'
            + 'zZs3h1988YW3e/fuN5cvX74hCAIwM2utqa4FAKQbkpiRTk2t1a5VmszQ1Ylb0kogaSWqOY+uEUBM'
            + 'MdUBcJx5OAgClMtl2rt376Bt2wPMPNDQ0DCWzWbLk5r6gwcPYt68eUopVcrn82rZsmWrqiUtxUuK'
            + 'yZO2WJNShREF89SibCqTMa5l8HoTN2ZGEAQUhiE++OCD7MDAwHdE9JVhGF/l8/nBI0eOlJkZk9Lu'
            + 'oUOHgiAIcvv27dvV29t7XkrJzMxhGHJVI3XjIc4W9Z7cTBsH0vSyeip9K6Xgui5fuXKFjx492m8Y'
            + 'Rq+U8lIQBMNXrlwpRwlXTBWiUCgUb7vtttGtW7f+s1IqVErpyLyVNlLXveH1Rojx478mY8eFZ2ba'
            + 'sWPHQDqdvgTgjNb6EhFlZs6c6V93sDU0NKTb2tr8OXPmlHfv3v3t+vXr/1zt0iaN/upNneN1VD23'
            + 'qGeFeuMa13W5UCjg9ddfH3Jd9zsAJ6SUX2qt+44dO5br6+uraULUfWggpTc8PDza0dFx6tlnn/2n'
            + 'YrEYVAeurLVGGIaTmp16LlQPTBx4VJ5EA7Boc12X8/k8Xn311SvZbPY7IcRJIcRXAPo8zxsvFovq'
            + 'F4e7P/zwAwqFQtjU1OQ3NjZ6n3/++cWVK1euSSaTRhTY9Wr1emVwvByOu1F8XiqEgNaafd+nXC6H'
            + 'nTt3/jAxMXEOwNdSypNEdC4IgrGLFy96ExMTvzyd1lqjVCpxR0dHYNu2C2B8165dJ+bOnbvwlltu'
            + 'mR0EAcdmmJPyw1S2iR+Pvsem2GyaJoVhyEopOnbsmLd9+/Ze13W/FUJ0E9FJ0zTPaK2vfvPNN+Wr'
            + 'V6/yb3rENDg4yHPmzPGY2W1ubnY/++yzb8+cOZObP3/+gqamppSubFFscFQxTg3weDke03rt/J6e'
            + 'Hr1t27ahQ4cOfec4zn8T0Qkp5UkhxPlCoTDc3d3tZjKZm3rIJx577LFUqVSaZVnWouHh4QXLli1b'
            + '8+ijj/5p4cKFrbZtQynF0aOneN9Q1XxNWCLiRCIBANTT0xPs27fvpxMnTlxubGwcYOYeKeV5rfV5'
            + '3/cvp1Kp8QMHDpRv+imlbdsAgFWrViWFEM1E1GGa5sJcLndrW1vbH1esWHHn0qVLO+fNm9ecTqdh'
            + 'Wda0PsL3fRQKBYyOjvpnz54tHDt2bOzHH38ccxxnmJkHhBA9zNwnhBgwDGNYa10QQgT79+//fR6z'
            + 'btq0CXv27MHixYvlnDlzko7jNEopOwDML5VKHa7rdiil2lpbWzuSyWRzS0tL2nEcO5/PI5fLBUEQ'
            + 'BKOjozkpZcmyrKxt2+Na61FmHk4kEleUUoPMnPE8L3/kyJEyfmXLdEPd+H333QellGGapi2EaLBt'
            + 'ewYRtUgp27TWjQBmBEGQFEJYVJ2/CCGU1trVWpeUUhOGYWSEED8BGA+CYCKTyZQaGhq8o0eP6ptv'
            + 'gX7DHzxWrlwppZQJAFZTU5NdLpdt0zRtpZRlGIbJzLIaH2EYhn4ymfTK5bLrOI5XKBS8ZDLp9fb2'
            + '+jfyN4Pf5d8q8W358uWCiKRhGKKlpUValiUKhQJV5/16ZGRESylVEASqVCrpCxcu3HRP+j9CY3oU'
            + '5eC30QAAAABJRU5ErkJggg=='
             ;

/**
 * This constant embeds file 20190209o0737.lgplv3-147x51.v0.png.b64
 *
 * @id 20190315°0421
 * @type String
 */
Sldgr.Cnst.sImgSrc_LogoLgpl = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAJMAAAAzCAYAAACT+Tr7AAAABHNCSVQICAgIfAhkiAAAAAlwSFlz'
            + 'AAADrgAAA64ByllTmQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAyMSURB'
            + 'VHja7V17uE5VGuccHPfbGJcanESEo3KPxqU6SEbFmNwNemQMpmlSJgkzmJCiDEKESKiEDlExM0Ix'
            + 'jULKuOUaKkOIjnzzLn57nndee6+99t7rO+d4+v74PZy19rru317rva315YrFYrkSSEAi17DaJQit'
            + 'CI8S5hG2ETIJMcJ5wibC84Ty/yuTmLgEGIHyENoSljHiKHxLWE+YTphAmELYSLhAOE3oE4hMuYbX'
            + 'mUGIJWCMbwn7r9K+/0DYTCR5kFBRQ76ahA0gXp0gZNqWIEggLLj0QnJu/04TjhHOs7TjhLFEjEIB'
            + 'VrOyhJOEDFMiFSNcTBAkEDoQ1uSwPinivA+SH0FaJmE6oXGE7fEDwjpTMrVIkCMQzhIKEZbmkP78'
            + 'nTCTsJxwjqUvJtxgQdZaS/jQlExPJggSCG9i3uZlcz/eI/ye8KFI/4bQ3qLgrjS7f5qSaQXryGHC'
            + 'Swy7E+S5AoMxb1Ozqf1/EXoS5rrkrSX8zCKRakPjG2pCpNxgstOZSSJ/k4XBK+F+GOEOQtUAqEHo'
            + 'Qpgmlu/vCNUJ1UIgDS9iDrQaR7u5hT1Tk/C9ZjytMDdjs5hEewi/JgwinBJ5SjYaQkiybE6YTzhH'
            + '+KkJmaqJTnVmeQXRySgT8BmhRORBDa8zgtX5DysTNbzOC6hvq0iv4zOmMnhuaBaRSGllAwmtCZ96'
            + 'kKxBHOxSlWEWmGlkZ8JXyjtWkeU1tTARLUR74whLDJAuyj3B6hwr8jqHrHMS6psu0vtrxnPE8Dkb'
            + 'uEB4Civ0Yo9ndhDKat5vAcJ1hMq651yIVIDwEVal6qZkmsY6dkjkPW7BOFaU1ZcHmpBJ2fqiL8tZ'
            + 'XjuRt8ywznqinGMn6iXSdYJ1BnvutjgSSa3oDQhdYTMyJhJMPV1AwDNCPKhlSKbZkJV6GbtTqPJP'
            + 'WGMLNS8wDOT2UduwnJKP8omyx1l+OU2eF9RE5hVfrLOF3yjq0ykdk4QYcMEyiZS9bwKhMGG85rkr'
            + 'iKT+JkwWhkqJWgZE6gciTfm/dB8iFWVCqMJDQjD/OuLEyO3jt4blNohyVVjePk2eDutEuZ8j/YQa'
            + 'K0sv7VPPk6Kejy0S6SChGaEkYbXmObXaVBXv8c+aFczBbvmRuhCpI+F7wvuEfEHIdKfXNqC+VguT'
            + '01u0N9ew3LOiXDeW94rI625Y59Oi3KNIXynS2/rU0zdOPs21IHKagTmmH9pOgZ3pK8M2WvsQaRDh'
            + 'ImSlMlfk+5DpCWHV5dtAbwsTVF2092/Dch1Fucksb6DIm2JYZ3tR7nWkDxPpf/GpR8prD1qYp2cg'
            + 'T7Y3WF0yCMn4iPYFaONVDYmSEG4Su+SDG1a7sOtzPmR6i38ZIu/FiBP0H7F9lApQdqkwnB7RCNFb'
            + 'DOu8VpRz6mwp0v38bbeJ52+JMEeZWHWTCCMN5b5fBhizg/VKvtNobW+ASHNVmIonX3zIxGWi0SLv'
            + 's4hkWiXqu9vCFyyF6MKGAvAB0ZdUJuwWZ+nJBitDVVFXXvQr6FiUknEPfHym2uiJEAL/Ni87H1ak'
            + 'eSyu6SyhR2AyKQegaPRulvcTCy9+hGhvpIU6pRB9u2G5RaJcR6RvF+k3G9RVyWUuNwQchxKg0yHz'
            + 'rI6jeUHJXtcYaG9lCO3gg1Ok6hyUTD2EOlqS5bWxMJC7RHvvWKhznKhziGG5h0W5iUifIdJ/Y1DX'
            + 'DS5zOTHAGE7CPpXM5LZ4QG1tpQNavFMIB5QAHpRM3En5aUAh1MRWwsmZ5OJLCoN2Ie1gjUQ5x8v+'
            + 'gEifHVSpQLmuhv34Cq6a3JAF40UkZXRNCelCmanCeIOSaYvGHvS3qNZbUV9Nj+feQsSiF14Vz0tj'
            + 'pYlKrBy2+VmZ/MyJW0PUt9Ogvlouc5lqUO6w0x6MkvEgkfqIh0b0x72mIiuNyeQiuPYUAuXZiIN6'
            + 'SbT3gN9L9uhnVY2xMg8MfH5oIMp1YNpmUgg5sbZHX3doynyhfGN4bliciHSYy70hiZQfBwjmByHT'
            + '7V5ygPKJWRhYXwMzw16XF5+qkesWWIgSaIiDAFG0zXoedY/XCNu1LGq0bpjPxYoIZGoLAbx9EDJx'
            + 'B+5xkfeQhcHdJOrcblium0au+53I64TtwgTK4XnIkrbZ3GNO7/B4vivyi8NdYpNEx12MsQVg/JwB'
            + 'MWIj/q1rQKbXCWcIBYOQaZkMQWV5Cy2cikgOeVjheo1cV9/D4x8WrUJqm/d7zGk+bJ1eTmHbAvcW'
            + 'J1wIDucOkDG97GSzDFelZwLZmYSX/TGRF/XrWSPqSzcNANPIdd9xB6Xw+IcVVEuE1DYHarbROUI1'
            + 'zxun7W0x/Hi/UjY0EWbiNd6WGiIVIxwk7NEdg3IbcGUv94BiuoWBjg55WEGukM0NPP5hsUPUlxag'
            + '7CgNme7FM186xsI4bG/rsQIFUZL+5LMqTcOqlK59zmXA3cQ5q/xCDok62Laawwo6yBXyjxqP/6CI'
            + 'fZwp6utjxWF6WdFQK2bTEIbVeGGCLi6cCNQJRJrlK1O5DHiyJm5okoXOl9YcVtChiejLmwYe/7Do'
            + 'E8GpvcWDSGmIDRtq2ccZ5UBmb58V6U5cUvExoWgYMn3EGhyvyQvlCxL1mcZEZUqvNv19lOVf4+Hx'
            + 'D4u0kNqmo+rndpnXpbD1FGRp9bKJSDv9TvBeujvg8oUVewnljEwHYsCFhLGynRBCZ4jQDxNwF8Q8'
            + '0V4vw8FvFuUqcYOfyIsq150SxkoZbWqCCqJPjXjQGkt/LotJdAZmn3wGp06OEo4RqhjbocTgmonG'
            + 'y1owBHJXSX+RN91wEp4T5bp4GSuZxz8s3vWJNjVBuov7aTcPj0H6l1lIpNckyT2IVIOwH6tS3UDv'
            + 'WgxusNeWFIFMfVmdbSzVucgtLt2SX2tUyD7xw6gDWPpd3DgpYqOygkSfy+NkGiI1I5wgfENoEngO'
            + 'NELteqiyUbGKH46ESl8gxMsqAJV/nqHHPyzahCTTHLftHKvSVqkxYTzxvjJnsN+WxojUGcK2kpFu'
            + 'DDUHGqE23prE59BkTLBTcxx7l3g26tGiPQH6xcGjUg8y675SHrp7EDAemlwmDmaUNyRRMmEM1P9N'
            + 'bgcFApNJCLUJREdlZqQs70GmMRbbO4T6UgM4bksR3gGRXvHyuYUhU5cEAayiN2x2BzRbYxEhBoTR'
            + 'zl7G/VlJASMA6hK+wL2UD1uRZUMaJFfBY+9gmaUXsBxfV4ZBaOtEPH8C9pucRqY52IIX+MhaeUA6'
            + '0+35JLz86g6IIiHCSPIShuMgpVL9m1u7yCKkl12p+7cyIduGZbw7rsHpBFnjZc2znWDGWIwjUnty'
            + 'IJlOSs3Oh1QlMK5ZUISW46NSYxxOuE9FTbgZRAMQ6WbCFmxrS9R9lFZvRQlxNc5JGDB3cX8UbkS5'
            + 'FS9WfZVNCI+w0NklsNkMcLFQH0M/1jJ/0UL2/0Y4EHoCcUUpOI/WhfniGiJ/DAxzpxHktx83hdRF'
            + 'oP5m5DVEvVOhbXXDad0PLJPK+lU2IVejEbj+Rqn9XePSDl5Gk6Dn3RAyWw3XxqgX0Rhx2atxxcu7'
            + 'SBsLN0xFxAS1d3HEXnD8a3CxzEK68rHdBJKlgWAZkDW2g6wtIHwmw9ZTGKdnRuNLf1uFV8As0QhR'
            + 'CmsQ6/0i6rkedzGNChghYIKm2UykevCtxXC/d7m4tSXO1Rudd8MWsxbYhZfh2KiaIRAsP/AU4nXy'
            + 'srQ/uFhnD6Oukcw6XIlFFbTEUe/pzCrdAfc5xRC/0xbn/dQqVAZW5wzcrlIchFuM0zX3odwLSHf6'
            + 'VtMymbplE4lScYDyIgyRPeLeJl7cG0EiEMVRp6PC+98chsWtOJF6AA7NidgC73FxnNYCoQ/i5V4L'
            + 'TaUoVrOV2NoOQfB0YqAqsL7XgG9xNsY0ALapYujPCvRzL/rwLMqp1ekX8Mn1F8ZHG3g8i0lUkjAe'
            + 'l3Cpbe2vUWxHYcgUxEektrZ17O+3mSMzBldHFawQzq0mK0CYVA/n5kqUScGW+wl70RWQ59x70ISF'
            + '0DZibd8LuWoj2jnmXJuIra8x7ic6h63TcX/sw4pWAkQ9b/vUbBaRSN0J8AhkIrWlLQripLXSB8Mz'
            + 'XVmFi1dZvaboGUcSVSI8zUik7uSuny1bq6XoyQT8XRztLBIoN6EFYSnhB5DoPULrbBX2syGm5seM'
            + 'cREPQLbEryrtAoFOQSaqniN+FcqClz2B4CEho91uS3Eh0HW4P3I5zqvF4P5YR+hPKJITSMTJ1A8H'
            + 'KxOIL4ZcuqP7sqoew/a0nTAVq42DBfDef83uRTqK223vVz8qmGN/ry7xo31Zbv8phbuOJsK1cZGR'
            + 'xiGOWnlmER6DQzb31TC2/wIqpA6qKjyUtAAAAABJRU5ErkJggg=='
             ;

/**
 * This constant embeds file 20190123o1126.plasticineprojector.v2.x0192y0112.png.b64
 *
 * @id 20190315°0445
 * @type String
 */
Sldgr.Cnst.sImgSrc_PlasticineProjector = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAMAAAABwCAMAAAB/yI9AAAAAAXNSR0IArs4c6QAAAvdQTFRFYmBR'
            + 'oWVWHiAq+7l+Ojs7ja/P24NpUjw8Jis4d6HRHiEqPUxj29WWHiAqY3iPwHZg8I9wcE1GHiAqMywx'
            + 'Hx8r95l0TGF99ZFxoXtdLzhIwpJpVG2NRVlzHiAqglVL4ad1YkRBdHJcW3mdKTA/HiAqISIsHiAq'
            + 'sW1bQTM2a4Oc5Ylsop92HiAqmsDill9SJCk10H5lHx8pNUFUR1Zn+PCmKicuZFFFX3SKillOkI1r'
            + 'Hx8rYH+lKCYtVEY/cVpKOC4zQ0Q/zJhsh2lTtIhkHiArbpK7KC07j29WHiAqHiAqZ0dCISQw6otu'
            + 'rINhyntjHiAqqmpZunJeTDk6VnGTTmWCOEZbHiAqe1JJZYevHiEpVkdA8+ukmXVZa4+7WD8+ncTn'
            + 'QlRtR1t3kV1QfWJPNDAzSFZpHh8rHiAq34ZqVG6PWHSWHh8qaFRGHiAqQ1ZvLDNDMz1PWGqAYE1D'
            + 'Liow0JtuUUM+STc5HiAq7Y1vHiAqJSs3LjZHPTE104BnQDc3HiAqVFNJm2JUS0tEUGmIMDpMHiAq'
            + 'Hh8p7eagHyAqd11Ma0lEhFhNWnWZpmhXQUxdXkJApn9eN0NYRTo5u41mi2tUyJZrl7vdO0hcW0tC'
            + 'RTU3vnVfnXhbxXhitW9c5pBuZn2WHiEqb4iijltQHiAqHiEqISEqXnyhsYZidE5Hd09Hf2NPICAp'
            + 'SF15HSEpbFZI1oFn/fWp1qBxqYBfsq5/qX1fICAqICAp9Kd4ICApSz87lHJYgWVQHiEqYHSLAAAA'
            + 'zDPMzDP/zGYAzGYzzGZmzGaZzGbMzGb/zJkAzJkzzJlmzJmZzJnMzJn/zMwAzMwzzMxmzMyZzMzM'
            + 'zMz/zP8AzP8zzP9mzP+ZzP/MzP///wAA/wAz/wBm/wCZ/wDM/wD//zMA/zMz/zNm/zOZ/zPM/zP/'
            + '/2YA/2Yz/2Zm/2aZ/2bM/2b//5kA/5kz/5lm/5mZ/5nM/5n//8wA/8wz/8xm/8yZ/8zM/8z///8A'
            + '//8z//9m//+Z///M////DcSaBwAAAAF0Uk5TAEDm2GYAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAH'
            + 'dElNRQfjAxYKGgDTbM4SAAAIRUlEQVR42u2c/08URxTAoZvSbqiKkrpYHLDKghDrmTYkNhw1bXIo'
            + 'giiWwiUliMTEOxML8dpKKDUxSpq2kqo0GhV/8Qf1h4uH+oNp+891d/bbzOzsfNs56LZ9P3H7jffZ'
            + 'N+/NzJs329Dwb5Pu0yCULOo/CWKSJfVBomRD/8uALdl9/9nACN5/oWC6kstljcJXrWgikssQhqfS'
            + 'eTMuHAo5jBOgK7pzUuc78B5pJkp6YxzaRb/1xCF9ALtNjrAxWM+/yLTiaT36D5lCIm+My/zgtk0H'
            + 'wF5TQpgUXQoBOhVCN3zEhCkricaIHt2Fnzhrzx1bteZKVsd6H6hoi2rdHBeWNwat6f9mtVik9GF3'
            + 'HdoaAIoxbsBjDe9GRx5YidIfXTVcpyAqjQF/3IkUG7fYgnQO6gATpibJzcP+vDlUqt/iy9Hg4os6'
            + 'ADRYZH+ovm0JSS2FM8dc4A7mWir6h69/1BKWRuVmRPPhcrkM1DFGgrsWaZqWrJZVKsK6ohGSNVTE'
            + 'GPCv7ovreB1ciJ7WRNpnRzBA0urD8hT+dQ9x7Uab7HiHsbMRu6ZFyQZCQQjBcOY8BcDV/yzxdk8G'
            + 't18Ay2324HTo5FNNaPPyj16uz0DCoxgwTRuMuM5+gHbRkKcCrv478O3n7c5TRijP2r7wLt2BXrlP'
            + 'Ohyp9MMD8AZoDFK+oYUf+OYHDYq0xTrqvOwISXkgMTDiGoOQWfi0Cqb+TvfQKSNB1ly3tmuRr8jO'
            + 'mLQNJBAHaCFevz1tMGSZaHJ5uRmT1oGE969mEG0euq3f4MjvDuMobWwkQqETYCDmwIvu+/+cB2Ac'
            + 'x7AfMOc+w926x9JkF4wY4LHzc9oQkE7nwp7wtu+9eJ0472MBtLs/Z2dn1RsQ0jeNOz/vGkJyzbm0'
            + 'hjeieca8byURoBhdJI1BNqAnzq/PDEFZQ2+tkO0ihsFwAfxaCYovyZju/LptCMsV8Or98FablijB'
            + 'NOP5sAIGaQAn/tuGnBCRqJ3yX54SBOwgJENxA150FJ3s/mwYqgTQBAus2YZ4ECKNQb+qMEQYQCD+'
            + 'swgYin2MEAhHUW6TmoAnjoQKdAAwmAYAZiuamTMmtW4sAsGP27gBnGn6C8NIQVBjvdrmFAChPXKU'
            + 'TriGtmEV9V8AUELb0A1WwNA6kKjiBnAa0CMVgOnoGcxRZgCgbyDRjAPk1QxgGAC0YuOJTQOADzqT'
            + 'MgRBgHxTNI5K1O1mfQDGAv1nVPV3R9Z+NmMVPvIO2wKkCxRVgYiJZEUZwPgunA7BR1blAJRzWcQw'
            + 'AqgDRIF0H0MNHyCekVDNyOFp3CYA2tQBgiFda7IGVQxAR0YOt0CNMYkXN8EOZQAFCtwFSgC8Utf/'
            + 'DdYTDLAA+JqJYuBByE7jAqEFvATLHhkfVqbYDQ+HSeeDWgA8C+zXAEDDuISdK2oMQhEAHB/eZLQg'
            + 'lZFQQNFOeSW6AeIFKFQAhW6rXC7SMoroWF4bwN56ACRktBALVLQBDCUGbT+K6knK4SlRu85NCBuL'
            + 'agEo4xaY0wjQzgtC5/GsXJqk3Dgyn3yjqv234YsYAwnT4kQXKKZMyi0jTvCHKsCzMDPQlOSiVawJ'
            + 'lZEzS6pJOQ+gQ0ccjZriaBJAmJMYpl+hQvGVto7AmZLxJsVRVogRRiVTizkcYAqATmWAZRQgxwco'
            + 'CBcDMTCKsbScnbYFeQAHGC4guj4mZAx8NJdmUh8ArHJ9OADIydc0ceeU6wBcUdH/ZbREPiUA4BMs'
            + 'qJU0sZxgVNEEyDMecIMQWlIoFfSXErv3xpSpxTWkRiFxPhZf31DsvNjLG0omyCPTusQXiy8xncDn'
            + 'WuoUPxAAYwqBaBCAX7kLBFVioZK2jKmEAe/MW2gjWpPTv5PoC8l5Hx0gsbZWliK2yC1rAld/vgEo'
            + 'AA0rjHVxcYoFPDPhlSLKADgme27xk+vMkoNUxoiZwNFoWVz/NvRmRmqaUfkBwCdpMJYojQj8KdED'
            + 'HCQrVuQBtp8719vbC4Bam4oBuLXRefFSA6TCy/tXgi6AA0C5hyxAiYPMe2dKCII7HngpVmfQYRFF'
            + 'T7OmPICv/7lYMYJYqxohJmb+QhE3GH0AopWlqAbWlG1BCQBcDISCUvDnxqK7nVz3XY0VgxdMeRdg'
            + 'AAgag+zNvAVLpifAirOpeCV4WAJwCYCJghzAPVadncCGkim86LIHrn4cp6rfH6sQ/wVgM5kCwHK8'
            + 'LBeYFAMQwWjFCea8o9fIwb8N07czxyiV+IH+t4JHHhDx4QVxAA5GB1G4G1Yi3n70lxN0jOPGleDI'
            + 'OnbhIjG+d/78cGPjdXikKtSE5KqXqQRzjH0aiFSIjTWP/YJktMlvOPI1APe5QahBEYCOMUYpsMcq'
            + 'Qm2ktoho/wAtQtqAEhzkAMybrv7zyvtxUAX7W2ibBEYXrX2HSzOLh2kng/r2+2jUfO3q/55f91Fl'
            + 'V/I655ZSbMYhMVosKTkSbGi6hYf9nxyAip+m5gAE//otTdurD8vo/+Mx2qbgPe6RT8NmxQPw0qUa'
            + 'N4gLq38m3E82S1v8Cdxi0/YyR57wWEj/xaD55wrUQp69AiOheiGc4av/vF80v7OZm8mjeNQj+Pb5'
            + 'y0WbuxsenWoLbOITmPftl95go/FjD096Yl3bkb5WqdlrcfM/R7CN1Ozh9edW7ahVshrzJ7mDWgLD'
            + 'S52Bq1v/xRbajgA2SLNfjaFh+3o9PhvSLTPX+Md9+aTrqkxqZwu/x7FydTimO0jKjCTldnZt+TdE'
            + 'VhwNHZDTk8mm2o6M6fV+vWGT2lqUWMAbYBbUTwDIkkQtKPMA9/4H2ArpilwgsxYwM+0CWG4qqwAf'
            + 'Qf0LGQWAndbS2/exIV72CDL7tUeUoOE/IH8DcUZ1uMyee+QAAAAASUVORK5CYII='
             ;

/**
 * This constant holds the data from file 20160612o0135.slidefive.v1.p25.png.b64 (7 726 bytes)
 *
 * @id 20190315°0521
 * @type String
 */
Sldgr.Cnst.sImgSrc_SlideFive = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+MDHAwFF/bV2Z0AABWMSURBVHja'
            + '7Z17XFRl3sB/zzlzAQaYAUaRi9wEBM1KESOiVHw1ZbXMNNS1tiwrs5vvWvvqWqK7bbctXS0vbVFa'
            + 'XtdN837JWyniLdRVuUjADAgCc2HuwMw5z/uH1bvvtr2vc+XM8ff9Rz8KwzO/+fI7v+c5v/M8BJCA'
            + '8/GCTGrraMFA+AEGQxBYdNeu5Jp1GgwECi0OynYsziQMi4FAocWBWa8ZSgjBQKDQ4sDZaR1GCIYd'
            + 'hRYJEnloPkYBhRYFlFK1vvkKBsKfCQNDEDj2lj6RQykFIZTQPM/RqN7pJ0y6+q9RaMRt2rQX4Ov1'
            + 'c4YBAAWAHleaEEIUqviXH19y8RyWHIjb9E66A6QyxYMMwwpkiYPA5Ll7RbcgjkIHELNBmyyUsSjV'
            + 'KUAI0aHQiMc4LO1qoYyFMGy5GGOMQgeIb7YuyHV22wUxFkp5YFkZCo14kZ2t7Q9QnqPCEJqCUp1a'
            + 'gUIjHtOmPZ/CsFJBTAgpz8GQ0S/WodCIx3R3mnOE0sOhUMZBYkbBcRQa8aZuzRbKWCSy0AaxxhmF'
            + 'DkS50XihwKzXCmY8YRG9q1BoxGNO7liSLJQeaJ5zUXmo8pSuuRKFRjzjRg+0MEJNCCHyMOVhdXw2'
            + 'Co14OCHssg0TTFM/YaDoqXWibflDoQOALCRCMD3QMfEDRHnLG4UOEJRStf7aZcGMx9llLRNzvFFo'
            + 'P7P7rzNyKFCh/HKBRBp6GoVGPKKl/gx0tNf92APd4/C8C/qkDmtAoRGPiEvNBZlcSD3QAOmDHzyD'
            + 'QiMeYzE0CqYHOiyiF6QNGos1NOI5dqtOMD3QoeExOrHHG4X2I4c3zs11dTsEMx6pLPwsCo14hMNm'
            + 'gC6H6QHK88KYEHIuKg0JL2/VVKDQiAeXd0U06FuuZDCsRBgTQkKIUp1SHps8GIVGPKPTarhdKLe8'
            + 'CSEw+tFV58QecxTaj1CeE0wHkDrhNlHf8kah/Uzz9+X3WIxNwrla2DvKboW4o9B+4rtDH2QJpWX0'
            + 'xi3vEK9vebdpLwg+7rgVmJ/Qt1y5TShN/ZR3QZ/U3AYAz4TUVh0tuHT80+T9a2elbXxreL7d3KoC'
            + 'QvpKZWEJnXYjcM4ucDk7geecwEikwLIyYCVyCAlTASsNgY622jJ1wm0Sh1VXFhM/wCwPU50Y89ia'
            + 'KkKIzx/jwZ23/cQnC/qfsHY0C6JtlOecUDRr/T39hz58U2XHwc/nTGr+vuw+ABjn7LJmmvVaIAwD'
            + 'AAQYL35JKaVAeRcFwhCgFKLjsoDnXCelcsXX8Rn5JwuL398LAFB9Zgv0z30EhRYSny/JpYbrwnh0'
            + 'TxYSCbPfv/azz/r4tteh4KEl4LAZY7aveHCmy9k5y2JsyuiyGYEwLCUBWqKhPEcppSRMGQvykMhy'
            + 'Vir/YsbC0xsIIcYz+/4MuWPnodA9XLMmLZsdpmEYYVR0SnWq7vElF3sBAFiM1yAiKgEopVHr38ib'
            + '7up2vGzWa9I5zulV9vWx4MBIZKBSp9WGRqiXT/ntgRUAAJ02I4QoorCGDjQ7VxdnCylXSOWKn255'
            + 'Xzz2cd76N/JeWz0vsajTZvxJYkZABxkRhgXKc2Bsu5quv165fM0rKculIYr19Zf2rQCAUxWHV8Lg'
            + 'wudwlSMQXLt6Akzt9YLqgZZIw/YfWv/ijI1v3ddxau+bJ9ubLo3rdpgFJfEvwTAS6LTpwazTTN//'
            + '6VPlpQsHngRKpwEAnNrzNpYcgWDTOyNPtzaczRXG5ZuHyJgk6GivA1YiE0VFx7m6iKp3xvmMnElP'
            + '3/vQH860N/0DeiUOwgztL7odJsE0TBCGAYuxSSwyAwAQViIHi15zx7kD75/e+NZ9Z7ocHUrM0H5k'
            + 'xQvRlOecGIjATMCpPExJYuIGvD3ltwfmo9A+5uDns3Mvn1h7Gk+LDfRcgQNVr9Q2LDl8iM3cBt2d'
            + 'lgk8FUYP9K0Ew7Bg0ml6o9A+RBHZG6zG5sEMI8ErX08U14TgpNDXmA3afniWdw9magyBjycpAuqB'
            + 'RqERr9BUHsm3mlowECi0OKg+szkXo4BCi4bm70+mCKUhCYVGvMYppH2gUWjEW+ShynyMAgotCiil'
            + 'WfrmyxgIFFocbP/goWShPBSLQiNeoa08DGaDdhgVSA80Co14RVJ2Icjk4eOFtA80Co14hbPbPgyj'
            + 'gEKLho627zEIKLQ42Fs6M5d3dWMgUOjgx6zXgqvbPp6nHE4IUejgJzImCeyWtmEsI8UJIQotDky6'
            + 'hmR8OhOFFg2U57EHWiBga5iX1F3ck7/9w0nAstKgfy8c56SEMEQiDYHouCzoaKs9rurVT6JQxoGz'
            + 'y9airTx0NiPn4bHOLovU2tECzi5bH4aVpHS01wEBAoRhoaebs1BoL6k592VusFYblFLK8y4SFZsB'
            + 'LCs9ouqd/k1EdN/dI4vfOwPw40albT99vc3UCgpl7J/+zetk7SudmWPS1Y+1ma6PNRs0agKEkh64'
            + '0YRCe0lrw9k0EmQ90DzPQWi4GhTKPl/0u3PClvwJr+0CAGiqWQ6JmQW/+H0KZey//XdCSBUAVAHA'
            + 'egCAKyfX96s6+7clbQ3npjqsOoZhAxcfnMp4yUe/SzvhsLQHRduoy9kF6oSBJnmYcnbxK0c2BqI8'
            + '2Pfpk4saq4+V2DqaIRB7leCk0EuCoQea45yg6p1uyhu/YMZvSipUsck5GwNV64594pPFs96qJX2z'
            + 'CpdLZAoAPzdwodBerW7QLENLpZBLCxoSFgW33fP4i78pqVCxUvl6AICRxe8FfCwPv7zrpYJJf0wN'
            + 'DVc38DyHQguRPZ882h8E2gNNeQ769h9x8Jk/a8mYx1avAADIK5rfo2PSN11qmPV2XXqf1NxtnJ9a'
            + 'BVBoD6n/xz5o014YRATWA31j80IV3D786TGT5+65X0hjK5y+DAgh/LTfHZt0x4hnVvsjcii0h6QO'
            + 'GgvyMOUEIqAeaJ5zgTphoOaZd7XKLnvHQSHHb9T05bPViQOngo9reRTaC5xdwumB5jgn9O0/fNOM'
            + 'hadSayu+Mo978jPBx+/Xvy/fPCBvxpu+LD9QaC9QKPtcCgmPqYyI6gs87wJKeeBc3ZTSwFYhhGGh'
            + '/9BH5k3+z33TAAAyhkwMmhiOfnTlgr5ZIzbyvMs3sUAtPaOx+hj07T/8n2vXxK9WTomNiIp/sLm2'
            + 'LIKVhuZ3O0xpzm672mJsAoZhgedclGGlPj0tjZXIIXPolOIxj63aEszxLF04sNas16R5GxwUOjAT'
            + 'taxNbw1XRMdlTWyuOxkukYblOzvNac5uu9pmbgWGsMBTjjKMxK3PUyINhTsL5xTf8+CioJb51O63'
            + 'IDN3SvLmd0Y2dNmNmKGDGYfdOGD/p7N6S6TyQouxKbXTqk+TSEPzrR3N4LDqgGFYoJRSwrD/S3ZW'
            + 'IoOhY+YV542fv0Ussdi5ZtrrV7/bttibRi8UWsAYrtcUfLN1vgKAz7eaWtI6rYY0qVyR77C0Q/LA'
            + 'McXjZpZuEdt7Ll04wGgxNKpQaCTo+WbrfHB22X594diaLzw9tQuFRgTHZ6/f3mHS1Ss9miRj+BAh'
            + 'cWDtMyCRK2yGlqpxhHF/VRkzNCJI/vq7ftRuaXP7+/DGCiJIZKGRWzy5Q4VCI4LDbtFB6qCiHTzv'
            + 'cruCwJIDESwfvZpKHVYdZmhEHMhDleVYciCioObc30EWGrmP510UhUaCnsychyE6Lns/cbNhGmto'
            + 'RNCseCGK8tzNt5ZihkYEjVKdhjU0Ih44V2cZCo2IhhBFTJ0791dQaETQsBJZLaUcCo2Ig5i4gR2Y'
            + 'oRHRcK32RBnjxmaYKDQiaO4Y/jRLeSw5EJGQkFEAFLDkQMRSQ8dnA1AehUZEg86dDTFRaETQEEJq'
            + '3dnWAIVGRAUKjQgaSmk6xzlRaEQ0qHFSiIgGk67eLU1RaETQXG8469Zhnig0Imhqzn0JBJftENFM'
            + 'CjkuHu8UIqJBKg+7nVKeotBI0KNrrgRt1REn48bBTCg0IljU8dnQK3HQeKyhb4XaktKsM/vey9u2'
            + 'YmKamN9nq+Y73p2vl6AaghNVrrlyaMjhjS91p91eNLGp5lsXISSdUj7dYmiSRcYkDbEYGmHpMyFA'
            + 'GAZik3IqAGCIWOMRrorLN7Zevemvx305/IC+pQpi4rJ+9u92s67g+PaFTmeXtX+nrSPVrNeqwlV9'
            + '8vUtlS6Fsk9+l90E1o5moLwLCCMBnuumhJEQQphfXIuNiErUzXyjspdIf7mTls0O07jzxAoK7ZvA'
            + 'p58/ulpdd36nMkwVl99UfcylVKfk28ytKqCQRhimt7WjGbod5huHAAEFoDfOF/T2iDdZaCTMfu+a'
            + 'KD/HnauK76+9sHMfw9z8vvxYctwkhza8MLxVUzGCAk0HnqYbrle5YuIHFJj1Wlj2bCgAECCEAZ7n'
            + 'KMOyxG5u/dlr/HhuiC/t67Qa4Mz+pXm5988tF1vM7VZdEQFC3QkZCn2TmNo1hS11p19jJbKfjldr'
            + 'b7xwY2b9T/26LMMEOltSbeXX9zfWfFPeN/M+UcW8u9M6lrgZT1zluElCFKoyhpX49BRYX8CwEtJp'
            + 'M44Vm8wAALaOa5luxwNVvTlGP7ZaQykvyLE5rLo8scX76JZ5kx1WPaDQfkIqC6uKjs0U5NjMBi18'
            + 'u3XBDLtFJ5p4a64cfoAwLJ6x4t+azlImxHExjATqLu2bEBahFs+E0NI2w5P6DoV2J0uHRJz24GAm'
            + 'v0MIgU6b/hFKadB/nhWHV8LhjS/PcFh1Hk1WUGg36JMy9Kw7u/gENqO1w46VUxYFe4wHFz4HmsrD'
            + 'czw9wB6FdoOxT3yyn2GFudLJMCxcbzjzfDDH12JshvpL+3PNujqPJ7kotHuXdl24KkGwMy+buTX6'
            + 'wLrZJcEa34ioeDh3cNkH1J2OfhTaO8IiYw9QIRbSAMCyUtBcORiUZcfZA0vh8sn1udeuHh/mzWI/'
            + 'Cu0m6oSBWyjPCbZ3wmZqgfVv3P2XYIvr0DFz4buDyzZ7myywOckD1rySTDttBuGWRgwLeb9aOISV'
            + 'SCtyRr8UFDHd9dGv59Sc/fsHrETq1etghvbk0i4J2SXk8VGeo5eOl57MGf0S6K5dEXQsT+19Bxor'
            + 'jyQ31XzrtcwotAfUXdwD6oSBm3jeJeRhErNeI9vw5r0X1AkDBDtIfUs13DXuVdi/7unTXXajT+Yl'
            + 'WHJ4yEevplBPeg0CCc+5IHXQuM0Tn/9yqlDHuHVpkbax+miiOw/CYob2A6HhvbYJdbXjpw+XlUDd'
            + 'xd3F+z6btUmI41tbMnhTY9WRvr6SGYX2dCXB3A7Zd8/4mOe6BX+FYyUyuFK2rnjn6mmbAAB6uoHJ'
            + '2Fr7g8xDNhmuVxf7+kYVCu0BisheMHT0S3ui+vQ3BcckVga1FduLN709/ERYhBouHF3TI+M4f2Q1'
            + 'RMWmw9/eH1tnaKksdufRKhTaz+wrnQkqdb/X3DlYvafLj5a603d/+tptRsLIknpiDHJFTFLpwgHG'
            + 'pppvUvzVQoCTQi9Z9dtE2u0wBdOQqTxUSZKyC0uKnlq3+OyBpTB0zFy//bCTO5bA3Q+8DgfWzV5U'
            + 'f3F3SeeN1Qy/eYcZ2kuU6tQSyvPBNGTS5TBB1enNJWtLBpv1zVdyAACulG/w6Q+pPrv1B8OkuWsX'
            + '3dlw6fgnJZ12o9+TKGZoH7Bybh/q7LIF49Apz7lIXFpeR2zq0OdHPvLuet9l5j+Mu1qxvcTQUjWM'
            + 'MAwNlGsotA/Y9E7hopa68hJ/THICBefqhvCoBIiISvwiLi1vw4hH3tn74//pmytvnBf4L9jM7aCI'
            + '/J89bioOryysPrNlorWj+TGzXqNkWCkN9FPFKLSP+Hh+JrWZWoL+fVDKU8rzRB6mAllIRGVUbKa1'
            + 'Q1f3VUJaniQ8KpG9XLb2QMbQyYN4Z1fvNm0Fz0pDhtrNbRmcqzPbbGgEhrCUBH4rBxTa1xxY9+zs'
            + 'S8c/XfnjZjJigvI88JQDoDxlWBnheRcApUAYFoR2VUKhfcjnS3Lr9C2VKYLbvOMWAlc5fMS5g3+B'
            + '3KJXR0tkoSgzZmjxsP3DyUvrL+56mWGlGAwUWhx88vvsOquhMQWw9MCSI9g5unkeFE5d9h+sNARl'
            + 'xgwtHg6sfXbq5ZPrNgbz2jRmaOQnxvxm9abk7FGbgqV5CTM0clNsfneUtuX7k4nEh03sCGboHqG5'
            + '7hQUv3IoSRoaUSf0p1tQaOT/JT7tLtjy3mh49p2m0RHRiQQAUGosOYKf7w59CDHx2Un7Sp/QdNoM'
            + 'FOOOGTqoGTJqDtRd2KkdNX1FcmiEGjM1Ch38jJy6FFrqT2vHzvwsOVyVQLCmRqGDnnsn/RHaNN9p'
            + 'Z75RGRuiiKqnPIdSo9DBzdAxc2HXmmltz/65sV9cv7ubeM6JQcFJYfDTVHMcEjML4KuVUzbWXdw9'
            + 'Fe8ootCiYW/pk9Ountu6juc5FnupPYdSHoUWCs11Z9J2fzTtgNV4rZ9Qj70Qem7ulXTHUrzOCYSi'
            + 'u0KND7+858NrtWVyh6W9gOdduF59E/A8R8OjEsmdI58bXfTkZ6twUigQRk1fDoQQbvLcPf81ovi9'
            + '/spe/Ro4VzcG5v+oMAjDQkL6PZue+lM14V1dXwPgKocgMVyvrnl88fm02++b9WJIeAwE2UY2fodz'
            + 'dUOkOkVbOHVZ7iPzDk4HACh46A84KQwWNvzpnkWG69WLnN12YG7hrj2Oc0K4Kr4joV/+8796+ov1'
            + 'x7e9DgUPLcFVjuCcwdPwL5dPeLe14dyzXQ4T3ErLfDznAqU6BRL7j1g85rFVJbvWTIPxz2z8hakh'
            + 'EnRs/3Dy4vbG889bDI3RPbE7UYB+gSnPdZPeSUNM4ar4OROf//KmtilDoYOY49sXjb967u+zuxym'
            + 'IodFB2JY7uM5FyiUsaBQxu/JGjb1g5zRL+4t3/0m5P1qPqDQIqex5lvom3kvAADsWFX8gtXU/Jyp'
            + 'rS6r02YAwrBB89A5z3Mgk4dDVGxGrUKVsPzB57asAACwdrRAuCrOrddCoUVC7fmdkH7nBAAA2Fv6'
            + 'xKPtjReLKM9NNlyvlgAhQAgjGMF5ngOgFFS9+wEQZndkTPKGSS/u2EEIsV4u+xwG5j/q8Wuj0CLE'
            + 'YTNAqCL6h78bs/Z/9tSwTqt+tN3cmsPzfLbZoAGGMEAppYTx3912SvkbS46EgFSmgNAItU4mDz8r'
            + 'V0TtGTLqhf3pd06oAQC4drUMEjLyffIzUehbUXirIWtv6ePJQPn8TpsxzdltT3d22eNloRFJdtN1'
            + 'cFj1N/oifszqhPxcFUqBAr3xJ+VBIg2BEEUMKJSxYGy9erxPam5oW+PFbclZIxwx8QNP5I1fcOrH'
            + 'b9VWH4Ok/sP98t5QaOTfrTCorcbmdE3VYWiqPgqm9nqwW9rBbmkHyrsgMiYZImOSICI6CaLjsiD7'
            + 'rulsSJjyxL++TvP35RDfLw8DiiAIgiAIgiAIgiAIgiAIgoiG/wZCRTS3wq/umwAAAABJRU5ErkJg'
            + 'gg=='
             ;

/**
 * This constant holds the data from file 20160612o0134.slidefour.v1.p25.png.b64 (8 776 bytes)
 *
 * @id 20190315°0522
 * @type String
 */
Sldgr.Cnst.sImgSrc_SlideFour = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+MDHAszDh7t9q0AABiNSURBVHja'
            + '7Z15XFRV+8Cfc+/MAMO+yzZ3RBRwwwRURAW3VLTMLAa1Ms1MLa00lxYtzSxz1zT3rdIZ2rTMLU1T'
            + 'yRXLBQUVYS6bIKsMMMzMvef3h+Kbvzd7XUC5M8/3v/l4Z5xzzncennPuPecBQBArgmAXSIOr5Zch'
            + '2K05AABQSuXfpK/rk152vlutxdjbYDG087L31n7cedEQFBppdJTXloGbnfvt1zuuftcprfRc7zJj'
            + 'cdwNU0VUSU2xa42lCgghlABDCCEgiBYIcQvTLYxbk4RCI42GHIM+bGPaikiD2dDfYKrsUGU2NCs1'
            + 'FgMFSlnCEgLkrqMmUgF8HPx0a3rrksqMJeBu74lCIw3LmeupEOEdWZc6eC3685PIUuP1hDJjaQwA'
            + 'ic416AGAAgEGCLn/4RGpCJxz8OEl8eu7XSq7CKEeLVFopGHYdGFVdNaNy/0rTZVxFtEUn2vIAYto'
            + 'AgBCGcLU21gIooW2cG/Jz++2Sn0wZy/EBz2JQiMPHYk7/8r/Ep1TmRUliELfstoyr0pzBQCllCEs'
            + 'eZDoe19SU4Fyzk35Zd03qb++uAZeCH8VhUbuzrGCw9DJrysAAJgFc9iqc4siMysuR4kgJFSZDS2K'
            + 'qq4BAAWGsNDQ8v5L+kF9lU341b106s9OzoBp0bNQaARAfyMLOJemt/Ne7aWNkalFxzsIoqW/WTB1'
            + 'zDXwIFIRCCHAANOoelWkInWzc+c39dmmfuvgK7A4fh0KbcvsytrWIaP8Qv+CqrwO5cbSqLLaEi+j'
            + 'peZm3sswN1cdGjmUUmons9dr++0K2529vbZf02dQaFsgp1Lf4sdMbc9rVXmdS43FkUaLMby0thgo'
            + 'FSlLZORxpQ71JbWv0o9Mi/6YS8k/wFtrTm1TQh/NPwQx/t1upw5fnp3fqaAqP764piiGZdjOuZU8'
            + 'iFR4rHlvQ3vtqnAjo1pP4E4XHecnPDENhZYqX19cE519I3PA9ZqiKAo0Ic/Ag1kwAyFAGcLa0g+b'
            + 'OsqdSYL6WS6j7Bw/M2YBCt3YOXP9dOff+J3RvCE7yiTUdq+oLQ+4Yar4z902YvOZFrVnHcgTPh25'
            + '3Mosfmn3jSj04+R4wRHo6NelLnUIW3ZmbiR/Iyvqhqm8AwDpfK0qHyhQYK03dagXqeWMnPg7BqkW'
            + 'x6/LQaEfEemlaRDm0apOXmZLxvo+Z4tTowRRGFBlNnQoqMoDEUQgQIAhDGp6n1KzhCUjWr4+pH/w'
            + 'IC0K3cDszd7RKa3sbL+i6oIO5cbSqNLaEq8acxXU3SrG6Fs/KBgFJDR9VjO85WvJKHQ9cc2Q3+LH'
            + 'TG1vfeXVTjdMFZG1Qk14UXUhAFDJL5lJARmRQax/d81b7d9LRqHvgYyyNAh1v506eC0+/Wlkuakk'
            + 'odh4PYoBpjNfmQUiFYEl7M0vhgI/cljCQivPtpqZMQuTUei/UW4sBTd7j9uvdRmbotPLzidYqCXh'
            + 'Rm1FhzwDD2bRBABAGWAJ3t5pPDDAgJ9ToOaL7puSUWgAyChN6/xL9o/RhVX5MTWCsWeZsdirwlT+'
            + 'yJ4yQx5ylkgpdZApi7Ym7GxiE0KnFh2HSJ+OdY0PW3luYeSVsowoCjSh2lLVIt+QA/TWny+UV3o+'
            + '+zj4kVW9tpBJh1+DBV1XWZfQV8ozIMQttE5e1x8ub+l0suhoB7No7m8RTR35ymwQRAsQwuCSmRXI'
            + '7GrnTmZ3WsyllZ7h+6ifsq4cOiX/YMdThUf7FVbndyyvLYsqNRZ7VZmrgAChLMMQfK7JumR2kjuT'
            + 'ce2mcFkVl/mhoSOkvcpRbiwN3XxxdefC6oIeZbUlkSbBFF5YXQC4ZGYbMtuzDuTZFsO4IkM+/3q7'
            + 'yZJuDHnjwHCaW6kHEcSbD6cDLpnZksxyRkFi/OO4ytpyfkanzyXfIFmegQdCCLDA4vDaHiLn3DRY'
            + 'fyOTXxxnHTtZZDimtomCUcCL4aMHDwgezFtTu3BpwgaRMXJ4Kvh5zYDgwdutrW0otI3BEhl08++p'
            + 'eSF8VLI1tg+FtiEYwkAb73aa8U9MTbbaNuIw2wYECAQ6cZoPO85LtuofLQ619WMRLRDm0Wrckvj1'
            + 'ydbeVlzlsHLMghn6Nx2kHRsx6UubSKtwyP8dSimIVASzaAaGsEAplVRk7hLQQzc2YpLNHISOEfof'
            + 'BBaoAIQQ4JyDQcEozjgqnA7EB/RO/T5z6yd5lbxKCu0QRAHaerXXTYueZVMHoMtQXoECAHGzcwdv'
            + 'B59iR7nTwUAn7vAzzZJO+Tr6/VF3bfFv17PzDHyQFJ4qFKkIatdmuk9il9jcaf42JbRIRRCpCHJG'
            + 'AYFOKnCUO51wkjvtiPGPO9YjqO+vddeVGkvAw94TiqqvgY+yCUz8/dXszIoMlRQOpBGpCB72Xrql'
            + '8RtssjSFdQpNAShQEKkAFAACnVWgZB0vsQy7M8yj9akRLcelEkLSAQAyyzOg2a1nvuvwuFXKwUfZ'
            + 'BKYeHnfhYul5Fcs0fpkFUaBhHq3TP++6wmbrrJBBP3enkvf35sSNUqDEReEK7vaexZ72XqeUcqed'
            + 'A4M1qWEeLf94kM8duXewtsRYrJFGmiHQYNcW/KK4terCqgLwdfSzSaElGaFFKgKlFBiGBX/HAHCS'
            + 'O59gCbujU5OuxwaGaG6nDgVVeeDnGPBA/8eEgyO0+htXJSKzSAOcOH5R3Fr1meupNiuzJIS+GX0F'
            + 'ACDgo2wCTnKnDAVrfyDQSXVkfLupxwkhVwAAUguPQ6Rvxzve+6Ayv5/ypvZc8Z8almElIbOXgw+/'
            + 'osdX6l3Z224XJMKUo7HICyKllBKlzBE87D2LXe3cT7nauf/azb/n0diA+KMN/R3mnpyhPZJ/QCNj'
            + 'Gv8fL0opdVa48F/1/Um95txSeLXNBLB1ZI9bYIEKQICAn2MAuCjczsgYdkc77+jTmtDhP9Rdl1OZ'
            + 'DUHO6gb/Pl+eXbD1l6wfNXJGLoWJL1WwCv1XfX9q+tHRySjzoxb6/6/5NlH6F7vaux/xtPM6MCR0'
            + '5CE3e/e/7vbeRyHzeynjx+7M2pYkCZkBqKeDF1kStyGuWco0+ChmHprckEJTSm8tm4mgYBUQ6MSB'
            + 'q53bCQdWuSPGr9vJ+KAnd9ddW1xzHdzs3R9rJ7x1cGRiemnaCimkGQBAXRSuZGLkDG5fzk7+09gv'
            + '0OL6FroudQAACHLiQCl3vCBnFXtbe7Q7NTRs5O2JW65BD4FO3B3v9XLwfqwdMOv45MQz10/rKEhi'
            + '9ZIqZY7khbDR3LGCw/zIVuPQ4IedFFIAEEULpQDEWeECXg4+xV723qc87D33PMk9daKF+4Ot+T4O'
            + 'vvhrbuLB3H06gVokIbMda0/6cAO4EmMx/07kh2jvg0Tom2u+IrCMDPwcA8BZ7nLCQa7cEe3T+VT/'
            + '4Gd31V1XYMgDP6cAyTT86/S1idszkyUjs4zISCuPttzl8nR+TuwyNPd+hKaUgpudB7jZuV9iGXZn'
            + 'iGvoqTFtJ96+XZxWcgZaeUbc8R4pyfxT5rcDvklfp7OIZkl8X6XMkTR3C2ueV5XLr+z5DVp7vykH'
            + 'pRQ87D1LVnfXhsvk8uvW0ti3f38FWCJXXa24lEWBSuJZcDmjgCGhL2sGhQxJRl3/N/84qIQQKKst'
            + '9Rj1W2LR4bzfVEv+nCP5hs46NhVULsEqvjJLT4FK4mgoGSODJ7kBKPPDCl3ndYWpnK46t0jv5eCr'
            + 'mnF0omQbufzMPGjl2VZ1oiBFbxZNFCRw0iRLWIj2jdWMaj0eZa4noQEASJXZQHdc/U7vKHdUjT8w'
            + 'XHIN3Jq+AaJ8Y1TbMnV6o1AjCZkZYCDELUwzJeojlLmehQYAIEbBSFMLj+tBpEFSatzu7O0QF9hb'
            + 'tfLsQr3BXCkJmQEAvJW+ms+6fIEyN5DQAADELJrpNWMB/8vV7zVSaNg7h1+DvuqBMPPYZH15bZkk'
            + 'ZDaLZogL6L1gZc8tKHMDCw0AQCyiBTZdXK3dlLYysTE3asHpj2F+11UwZGdCdmF1gWRk7hnUT/dW'
            + '+/feQS0fjdC3Ot4EO7J/0C06/UmjlFqXsQkmtZ8OL+8ZlF1jqVZJ4bR2i2iBDr6xurfbv5+ESj5i'
            + 'oW8OgBlS8g/opqe83aikTsk/CJrQ4fDaviHZZbWlkpBZoAKEebTSzeg0F2V+XELXDcSFsrO6Nw4M'
            + 'bxRSX624DLH+8TDhwMvZ16rzVQxhJLFD298xUDev60qU+XELXTcg+YYc3acn3n//cTekqUsIM+Xw'
            + '2OzsyquSkFmgAnjae/24sucWlLmxCA1w87iAlILfZy/7a672cTZk1L7EH9JL0ziWSOS4AffW+nW9'
            + 'v3sOFWxkQgMAyBk57NH/rJlz4v3HIvVr+4dqi2uKBkplU6vatRn/edcV6uwbV0RUsBEKXSf10YJD'
            + 'mmlH3nikUk8+PEZbUJUrmeMGmjj680vjN6hT8g5CU9fmaGBjFRrg5sM0F0rOal7/7aVHIvWsY1O0'
            + '6aVpGpY0/shMKaXudp78qp5b1cmXNkNsQDza19iFBgBgGRZyDXrNS7uf2QoAkFupb5Avvih1tvZk'
            + '4R+SOW5AKVfyG/v8oF50ejYktngJzZOK0AA3a3lUmEqT3ksZzwc6c3DqWv0ep/HFX/OW78/dpZFJ'
            + 'ZIe2r9KPbOm3Uz350Bh4u/0HaF0D0qAHzQiiQINdm/OL49ept2cmw8BmD79kPWb/UM21qnytRKrd'
            + 'UjeFO5nTdRl3tiiV76N+Go2TYoT+W/pBsm5cUY3dPyx7YLNEWH5m/kN93tQjrydery6UjMxOcmcy'
            + 'LuId7mDOXpTZGoS+lX6Q/Kpc1ci9z2W/HvEOvJ/y5gN9zuenPky8Up6hE0ESK13UQaYkzzRL4k4W'
            + '/sEPCR2BplmL0HVSlxqLVcN2Dcj+JHYJbExbeV/vX3t+aeLJa3/oxFtnfzR2meWMgnRs0oW7UHqW'
            + 'HxeBD89ZndAAAIQQUmU2qF7c/XTxwKbPqb+7fG+7l3+4vCVxr36HziKN4waAAKFq12Au+0YmP73j'
            + 'Z2iYNU0K7xbB3O08yJtPvMcdv3aEH93mzbtN/kDlEtzifPGfGTWWakl0poKxg6FhIxMGNkvchWpZ'
            + 'eYT++4+orLaULkidpQ9wDFJ9dnL6f13wbsob4OcYqPqz8HhGjaVaEmd0yRg5DAx+XoMy257QAACk'
            + '0nyDbslYr3ez81BNOTz29j/MOzUTQtxCVRdLz+ot1CKRHdoyiAvspRka/gpunbLBlOOO9EPB2JHm'
            + 'buFcYU0+H+PXDYKcOdXGtJX6akuVNHZoEwYivKI0MzrNRZltOELf/kGZxFqaXnZO3y2gV0yUT0zg'
            + '1xfXSkZmAgSCnNUoM0bo/47U9qwDUcqU1aW1JQ5SkFkQLdDCveWr87utWosaNaK5TGP5YRmFGjAK'
            + 'NUopdJpZMMGApoO1YyImosyYckgbi2iBroG9dGMiJg7B3kChJY0gChDhFambGjUT9wGi0NJGpCI0'
            + 'dW2mmx27GGVGoaUvs6eDt26JjRaEl5TQIsV9mv8jzaBh7q0vru/9HcosBaHbeD6x2SJasCf+MTIL'
            + 'NMQtlJ/bdXnLoupr2CFSEHp27OLhXf176MyCCXvjzjSDBjpx/MK4NerzxX+Bj7IJdopUcugp0TOT'
            + 'BgQ/pxVEAXvklszeDr788h5fqffof4bWXu2wU6Q2KRzT9u0hIW6hrxBpnAneYFBKqYvClV/bO1m9'
            + '7vwX0Id7Ci2RotAAAAvj1qznXIIlcWhLQ8ksY+VZX/X9ST3r+FR4pfUbaIjE+K8TWo5tPJ02ZELi'
            + 'xes1hc9TsKkVEOrl4EPW9Py2TVkPfeXnXVagHRLkrvnF8r/mJ/6et1dnlkhxyoeV2UXhSt6Nms1d'
            + 'Kr/IP93seTTD2oQGANhycX3i9qvJOpNYK5mCOw8is6PcibwcPo7LMWTzI1qNRSusVWgAgG1XdH03'
            + 'X1z1y61ildYmNbVj7Ulf7imupLaEn9R+Ohph7UIDAEw78roqq+KK3iSRopX3KrOMyEiEVxRXI1Tx'
            + 'n8QuRRusgHtazjAJJj7WvzvnIFMSAKDW0HAHmZKEuIcF51floMy2FqEBAGYffxdaekSofszcIqki'
            + 'lv+EnJHD0NBXNM+EaHDrlC1GaACADzp+CoXVefyb7d7l3BTuko3UMkYGfbmnUWZbFxoAYGzEJLhS'
            + 'kcHPiV3GeTv4AqVUUlKzhIWOvl00I1u/gTLbesrxd76//A3xVfo3nZ86M1MiJ4ECAQbCPFtq5nRe'
            + 'hjJjhP4Pe7J/hg6+XYLWnl+aSQiRRIQWqQihHi2/RJlR6DuY+Pur8CQ3gJl98l19halcMhNDhjBw'
            + 'pTxj7JLTcxJxyDHlAICbR3RNjvoQknb2yzZaaiRRdvifcuhWnm01M2MWYqS2ZaG1GRsgKXQEDN8z'
            + 'KLuitkySMv/nTxID/k6BmmXdN6HUtphyHMrbD0mhI2D0viHZ5RIpCP+v+TSIkGfI0X18bNoUHH4b'
            + 'i9BXyjIgxD0Uxh94OZuvzJJEDe17xSKaoQ/3tO6NdlNw86utCE0pJVOOjMvKKEtTSaGG9v1iFs0Q'
            + '6xene7fDJyi1LQj92r6knQVV+X1ZhrXafVkW0QKtPdvpPu2yDKW2ZqFf2zdEe6063ya2YwmiACpn'
            + 'te6LHptRamucFE46NFpbUJ1nM3sLWYaFHINeM3zPoK0AAPmGXDTDWoSeeWyy9nLZRUkUhK/XjiAM'
            + 'lNeWJL13ZILe3ykQTheeQDuknnIsTP1YeyB3j1RqaDdU+kFD3EKLFsatwZNlpByhl/81f9Vvubtt'
            + 'WmYAAEIYUmEqn4BqSDhCj94/RFNUVaCV+D2Th8YsmiBB/ezacRGTXkU1JBqhpxwe+3yxdArCNxgW'
            + '0Qw9AvvqUGaJC3214koytY5tgg+RN1sg0jdGNzFyOi7bSV1ogdr2UboCFaC5e7juo07zUGZrmhTa'
            + 'IiIVoYnSX7eg22qUGYWWepohUD/HgL2re2lRZhRa8mkGDfVoyX/Z45u+5cYytACFlnSaQTnnYH5e'
            + '15XqK+UZ1M3eHS1AoRv4SxEWXBSu+SIVaX3L7Kv045d136g+lLcfmruHoQEodMNCgADn3DRpU59t'
            + 'Ad4OPnx9SU0ppW52HvzqXlr1lvT10C2gJ44+Ct3guS0EOXMvL4xbo1t7fhms7f2tOtBJxYtUoA8r'
            + 's73Mgd/U50f1vNSPYGjYSBx5FLphMQsmSFAP0i6J37AJAGBU6/GwO/snWN7jK3Uz11BeEB9Yaurr'
            + '6E+29tsZ/Pbvo2By5Ec46ih0w2IRzdAtsJduTNu37ygI31f9NJy7/icsjFujDvdok/4ARUKpq8KN'
            + 'fBD9KbdXv0NcFLcWRxyFbuA0QxSgnXe0bspdCsK38X4Ciqqvwdyuy1t62nvr7kNq6iR3JqPbvMUd'
            + 'yt/H91FjNSsUuoG5WRA+RPdx50X/enOjrujl+ie/S+JcgnX3UE+R2rMO5KngwVxq0TF+WNgrONIo'
            + 'dMPL7OXgo1sSv/6+7tQtjd+Q1Narve5fyjlTOaMg7X07cRdLzvPj203FUUahGzzNoCGuoafX9f72'
            + 'gW47z45dnNTFv/vdyjmLKhc1l1uZzX8YMw9H2MYgg37u/kifHRWpQENcw/gFcavVxdVF4KX0eeDP'
            + '+vLMgq27srclsYwMAAAUjAJeDB89eEDw4B9waDFCP4o0gwY6q/kFcavVaSVnHkpmAICxEZOGhHu0'
            + 'HUOAgIzIYUDwcxqU2baRUUrhUexWuV0Qvvtm9a/8L9DKM6JePndu1+Wrxu4fVh3s2hxeDH8VD2C0'
            + '9ZRj7P5hm/Kqcl5qyGML6grCb+67Xb0hbQWMaDUOex5pmJTjy57fDA9zb/1vqwYPLbOcVWRt7rtd'
            + 'Pfv4NJQZaVBYAICUDSe/e+mtYeG8Iat1PUdq6q30IZv6bAsric+q+qzLcuxxpGFTjr+/WHz6U+2+'
            + 'nB0aOaOoF5ldFK7kgw6fcRllafyA4MHY28ijXeV4q/27ST2DEupj8ZY6yp3IiPCx3B8FB1Fm5PFE'
            + '6DrG7R+WWFhzTfcADwMB3CoIn6AexBUbi/iJ7T/AXkYer9AAAO+lTEi8VHZBJ1DhvmSWETlp5xPF'
            + '1Viq+dmdF2MPI41DaACA+admJR4vPHzPKyB2rB242rkFyYg8d3mPr7B3kcYlNADA+vMrEnfrt+nM'
            + 'ovlfr5MzCnghbFTS082e12G3Io1WaACAbVeSNbpLG7VGoeYfi23KGBkkcIM0I1qPwzt1yGPlnp7l'
            + 'eCYkUeer9FfLGBkBuPMgPJaw0KlJV5QZkY7QAAAm0aiP8Izi7Fj721IzhIEW7q00kyJnoMyItIRe'
            + '0eNrqBGq+QRuIOcocyIAAL4O/po5sUtQZkS6LEz9GH6+8r36s5PTp2NvIFZBRmkadgKCIAiCIAiC'
            + 'IAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIAiC'
            + 'IAiCIAhiXfwfjRgIG8EtBZcAAAAASUVORK5CYII='
             ;

/**
 * This constant holds the data from file 20160612o0131.slideone.v1.p25.png.b64 (6 868 bytes)
 *
 * @id 20190315°0523
 * @type String
 */
Sldgr.Cnst.sImgSrc_SlideOne = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB+MDHAsGA8JtSKYAABMZSURBVHja'
            + '7Z15WJVl+se/z/uehUUFDgqSCgQuYdkvTUXNLa38qVAuIQKOWqnTlAszzYxXzjQzNV7q2DWX5pLX'
            + '9Zs001ApIxXEdGZcAmWxRXMh2RQcgXOAw76c9fn9wZKVOlrneYHX+/PXUeGc99x+eLjf573P+2Vp'
            + 'aWkcBKESJCoBQUITRCdF84M/1wG4QKITXQQngCEAut9O6Avjxo17gupEdBXS0tJOAxhzu5aDVmai'
            + 'S7fNJDBBJ4UEQUITBAlNECQ0QUITBAlNECQ0QZDQXZBLv/rVw1QF5dFQCVxHWljYKABxAGLNp04Z'
            + 'OOcGxlgVVYZW6M4u7s2Pp6aFhe1OCwvjADIAvArAwO12XFiwYG55aioVjITuvBKnhYX5AohJCwtL'
            + 'bpU4tXVVboMBAJNlNOTmTus1bRoVj1qOTiezD4DYtLCweAD9b/El7Id/wTkHdzojqHq0QncWiUPT'
            + 'wsI2p4WFVQIwA9hyG5lvCWMMNrMZuX/4w3yqJgndYeS89trMzwcO5ADy2/rhn1xcrRbmU6cmU1VJ'
            + '6A6j75IlpeD8tq3EvcA5B7fbaYUmoTuO7oMGZboFBrrkuRhjsJpM+M/771MvTUJ3HEyjueKy59Lp'
            + 'uHH/ftrqIKE7Do239w3OXXS7EsaYrbo6mqpKQncYWi+vm/von+czAEtZmcGUnBxKlSWhOwRHY2Oe'
            + 'q4QGACbL3JiUtJQqS0J3zArt6wvuWqFZY2Eh9dEkdMfA7XaXP6fFaBzIOfeh6pLQilKflwdLaamT'
            + 'MebaJ3Y68fXs2bHmzz+nIpPQytFtwADo/P3HQHJtaZgsw1FXN88wfjwVmYRWloacnG4uX6E5h9Vs'
            + 'HkXVJaGVL4q7+1hX7nK0LNEMjtpaXPzlL+Mar12jIpPQymA6ciSiMTcXcPUKDYBpNGi6di3GIziY'
            + 'Ck1CK0NZYmI002iEpBpwzmGvrZ1OVSahleufr1yJZZLERDx327BS4fr1NKxEQosn769//ZO1vFxo'
            + 'TZhWy6tOn6bZDhJaPNVpaW9KWq3YF2GMOerq4qjaJLRQLq9Ysb7p6lXhr8MANBUXs6ItW2hYiYR2'
            + 'Pde3b0djUdGQ6vT03zGNMp8ZZrLMqzMy4kk/Etrl9H3xRVxavDjF3tCgWF4jkyRmrayMJf1IaJdz'
            + '6ZVXUhsLC/sxxpiSr9tUUGCw1dfTsBIJ7TryV6/eXPnPf06VtFqmfOUlnJs9O7bs44/JQhL651Ow'
            + 'bt1vS/fsWSp8V+P2bQcknS6+d1QUWUhC/zzy3npry42dO992+bzGvcA5mq5d688515OGJPQ9U370'
            + 'KADg/Pz5x0p27XpV4Zb5Fks0g9Niwbk5c2bXfPEFmUhC37NAT38ZGcmrMzKeUmp77r8ekizDajTG'
            + 'eA0fTiaS0P+daxs3AgCurFx59Nv4+GON+fmQNBrW4atze9fBwR0Omusgoe/MjYQEAIDDal2WPWkS'
            + 'L/vkk6fhdHbCXxoMFpMJOb/+9VRSkYT+ERWtfbK9pib6q1mzqq9v27bJUloKSatl6CSr8i3aDl5/'
            + '8SJdZCGhf4ytujr2fFxcddGGDfsacnJ6yPousYHAHM3N80hFEvrmXjn+q+eeq7yycmVC7VdfeTFZ'
            + 'BoBOuyr/qO0oKcF/duygzxu6gC57B3/OuU/O8uVLG/Pz3yravBlMp4Ps5tZmSZd6L0yj4aZDh+IA'
            + 'ZJKS94nQlSdPwnfiRJQkJIRW/Otfb2dPnDjTUlICptGg/WpfFxO5XWhJYraamlgAy0hJFbccdRcu'
            + 'tD8uSUiI+WbhwqqCNWvyq8+cmWE1mdC+n9xFRb6Z5uJiQ+2FCwNISRULbTEa487FxSVnjR/PzSdP'
            + '7qnJyvLmDgdEfeavg9sO5K5c+WzRli1kpZpaDlNq6vTShIRoW1XVLy4uXgxJrwdjDFLraswYU+V/'
            + 'BJMkcIfj5aClS/9OWqpEaFNq6iOXlixJkT09OZOk707y7hOar1/vzzn3ofRZlbQcftOmXXQPCjJD'
            + 'hS3F3cDtdlx48cU40+HDZKZaemiNt3eiS2/O3JXaDllGQ07OFL/pdC8a1QgdEBWVyq3W+3OFpvRZ'
            + '9QndZ+HCFJ2fX+dZpFuPgzudcNrt0Pn7NwtboSl9Vn1CAwDTaHZ15G5G2w8TdzjAdDp4DByY7xES'
            + 'snRcTo5h5IkTBi5wck/SamE+eZLSZ9UktGHixH87bTblf91zzp02G3Q9e0Ln75/S4/HH54395hv2'
            + '+MGDA/otWbJV0miqGGNNen//XKHH4XDQCq0moQeuXr3L1cE9txXI6eROiwV6Pz+4BwUl+M+aNX1U'
            + 'ejoLP3kyMuT3v09o+zr/mTPbv8ejf/9j3OEQcnDt6bM7dlAv/VM2FTrtGT9jKYyxCEESg9vtcA8K'
            + 'Mmu8vff4z5iR0Gf+/JbBoNaZagDoMXToLb+/19SpG82nTi1tnepz/XvX6bjxwIFIACmkqApW6PIj'
            + 'R+A5cGAqdzhc2g+DMbgFBeXrevde+nhq6qCRx4/7DktKWtYu813SOyqqQOfnV8EF/jTbKitnk54q'
            + 'EbrX1KkY8sEHiT/1w6xtEjttNmi8vKDx9k7pMWzY4rGXLvmO+OyzAQ/ExGztNmjQz+qD3fr0SRXV'
            + 'E7Wmz/qaDh2iGzqqQejWRcrs1q9f/l1L3CIydzY3Q+vjA62v766A2NgFY7Ky2OiMjMg+L7zwHmPM'
            + 'DACBL7/8s4/Pd8qUj0XulzNZ5saDB1eQoirpoYvffRfGAwe2cqdzA7tDxBp3ODh3OJg+IMCs6dFj'
            + 'b8DcuZ/1mT+/pfdMT/9u1Z8yxaXHF7h4cUpGeDhsNTVCBqaYLLPG/PwppKhKhA585RXUXb58+KvI'
            + 'yA1Mp2vrJQDGWvphSYK+d+9c9+DglN7R0e/6TZ1aAABITVXsGGV397322toYUc/flj5Lw0oqaDkA'
            + 'oPvgwXnuQUFmAHDa7ZA8PeHWr19m90cfXTouJ8cQfvLkoEd37nytXWYFsZrN6BEefkTofjnn+Hr2'
            + '7NjKU6fI1K6+QreffAUGvi9ptQ+5h4TsfXjbtgQAqEpP7/C5aJ3BAAC7z4wYsctRVycmBk6SYK+r'
            + 'm+c7YcJWUlUlQj+6c+dvAaCpuBjYtg0A4DN2bOc5eZWkFAjaLwfnsFVW0qfB1dJy3Ix7YGCnOybj'
            + 'wYPwDAs75or98lv/tDA46upwcckSSp9Vm9CdEf/nnsOQ99//UNQVQ6A1fbaoiNJnSWiFWg7Gqu5l'
            + 'v/zeuw5KnyWhFeTaxo3QdOu2U/SwUsG6dTSsREKLJzg+HiGrViVyh0PcVUOtllefOUPpsyS0MngN'
            + 'H57v1q+fWWRf46ivpxs6ktDKoenRYw93OoUNKzUVF+Papk00rERCK4P/rFkfcZtN6LBSTWYmpc+S'
            + '0MrQd+HCNP0DDwj7lA2lz5LQyhfTze1DtEyyCqGpsNBgq62l9FkSWhm6hYXtgcDdDkgSzkVFxZZ9'
            + '9BEVm4QWz+DNm49oe/US2Xa0pM/OmUPFJqGVgclyirBJwO/SZz2o0iS0cKozM6Hr2XOPyGElp8WC'
            + 'r6OiZlSfPUsFJ6HF4j1qFIYmJaVKOh1E5YgzWYatvDzGe8QIKjgJrUDLwViNe3BwvqiYDM45uM1G'
            + 'cx0ktDKU7t0Lp8WyUdT97xhjsJaXIyc+ntJnSWjxBMTE4H/27dsPUX00AMgyr790iS6ykNDKoPP1'
            + 'NbqHhpoFvgSlz5LQyqI1GMQNK7Wmz17fvp0+b0hCK4PXiBEbhc5IazS8PDk5jipNQivCg7/5TYF7'
            + 'YKCwwY6b0mcJEloZZE/PD0Xe5Lq5uNhQe/58f6o0Ca0I3qNHJwqdkdZokPfHP84s2ryZik1Ciyd0'
            + '1aoUfUCA0GElp9W6JGgZZd6T0Eq1He7uh0XetqwtfZYqTUILp6GgAG6BgXu53S7sNbjdjosvvTTP'
            + 'lELpFSS0YDxDQzFk+/YEuXt3ocNK9ZcvP+MXQeMdJLRC6Hr2PCt0WInSZ0lopag8fhyyp+cHIoeV'
            + 'bGYzrqxaRdmGJLR4fCdNwtCkpD0QeGIoabWoOnWK0mdJaGVgjFXp/fwofZaEVg8eAwYIT5+9Tumz'
            + 'JLRS9Jo2Teywkk7Hyw8dmkFCE4rQe/bsAr2fX6XI9FmryURCk2rKoQ8IOCQ0fdZo9DUeOBBKQhOK'
            + '0HPatCTR6bOm5OR4EppQhH6LFqXoRN5ZqSV99hkSmlCu4Hp9gshhpbb0WRKaEI61qgreY8YcFZ4+'
            + 'O2tWbOWJEyQ0IRadjw8GrVu3W2swCJ2RttfXz/N98kkSmlAGJklCb+h4P6fPktAKYzx0SJn02cWL'
            + '4xqvXiWhCbH4P/sshuzYoUz67IMPktCEAi2HAumzjvr6+zJ9loTuAK698w5kD4/totoOxhgsRiMK'
            + '1q6NIKEJ4QSvWIHQP/1pPxd4Q0em1fLqjIxoEppQBK9hw/LdAgMpfZaEVg9aJdJnN24MJaEJRfCb'
            + 'MWMvt9vFps9mZcWT0IQi9H3hhTPC02fN5lgSmlAMWYH0WUt1tQ8JTSiCpwLps9/MmRNbmphIQhPi'
            + 'Gbxpk/j0Wb0+PiA6moQmFPpP0GgofdYVeHiQ0B1NdVYWtD177hWePvv88zOqs7PVXczGRhK6o/EO'
            + 'D8fQTz45JDx9tqIixnvkSGo5CPEwxuopfZaEVg2l+/Ypkj57ecWKqSQ0IZyAuXPxaGJiIgQJDQCQ'
            + 'Zd5w+XIsCU0ogt5gqHAPCaH0WRJaPeiUSJ99771RJDShCF7h4eLTZ1NS4khoQhGC4+MpfZaEVhdK'
            + 'pM/WnDvXn4QmFMF7zBix6bOyjIK//OX5a5s2kdCEeEJff11s+qwsw9HY+FLw8uUkNKFQ20HpsyS0'
            + 'WmgsLIR7cLDY9FmHAxdeemmeKTmZhCbE4hESgkf+8Q/h6bMNly8/4xcZSUITyqDr1YvSZ0lodVB5'
            + '4gRkDw/x6bOvv/4LW1UVCU2IxffJJxVJn60+fXqK1seHhCbEo0T6rNNiUd1lcBK6M58gik6fLS/H'
            + '9ffeiyChCUXoFREhPH22IjV1FglNKELvmTML9P7+QtNnLWVlz5LQhGLo/PwOiE6fLUtKCiWhCaXa'
            + 'jgOi02fLDx+OJ6EJRVAkfTYv7xkSmlAMptHsEpo+azKpJn2WhO4C+EyY8G9F0mePHyehCfEMWrNm'
            + 'l+j0WUdDwwLfSZNIaEKhtkNw+qy1omIEtRyEIpiSk+E5eLDw9NkLixbFNRYWktCEWPwiIzFk+/YP'
            + 'mUYj8sQTzUVFMR4hIZ3u/ZclJQEA7ubuqSR0V2k5GKty69tXbPpsU1OnSZ+9+vbbbcflY/z002Vf'
            + 'R0Wtv5u7p5LQXYSiTZsg6XT/J3JG2lJaioI1azp8WMmcnh5anZ3957NPPZWXPniwuSYra1NzcfHv'
            + 'qOVQEUHLl6P/6tWfivysYUemz5YkJDz95fTpm7ImTKi8sGBBft35839uvnGjP9DykTFrZSVy33hj'
            + 'PgmtIrwee0x8+mxDg9AbOprT0tofX16+PCJ78uTdmU88wfPeeONYQ0HBUqvJZJB0OjBZ/t6WjqTV'
            + 'wnzixGQSWmVovbyEp89edXH67I3du9v6Yd+r69fHZI4dm5wxejSvOHIk2XLjRpy1shKSXg92h31J'
            + 'zjm4w0ErtNroFRGRIDp9ttaF6bPNJSVBN3bufPWL6dPz0h95pKIhN3ePrbIywlZVBabRAIyxu9lf'
            + 'Z4zBajTixgcf3LHH15AiXYt+ixZlZo4bB2t5OURcaLkpfXbZT96h2LBhYE1GxjJbVVVs1vjxBibL'
            + 'YJLU9vztgt7zsel0vHTfvv8FkEJCq4jW9Nm41i7B5TQVFhosZnNPvcFQcaevq79yBd0GDQIA5L35'
            + 'ZkRtdna0vaFhXvHWrWCyzJkkMUmrdWmPb6+riwGwlFoOFeE5eLD49Nno6OjSfft+9E8VR4+2Py5c'
            + 'uzYue/Lk5KwJE3jJ7t3JDQUFcRajEZJWCyZJLj8+BsBSWmowpaaGktAqYvA77xzRKZE+O3fuD0/M'
            + 'fIq2bHn1y8jIi6cfe4xXnz79oaWkJKJdYiZyyPW7Hr8sMfEVajlUBtNqUxhjYi6CfJc+i9J9+0Ir'
            + 'jh6Nb7p6dWraQw+FtvfBnKPtUrx4jb8nNGsqKooA8BoJrRKqs7NR+Le/7bWUlkYwWRZgDYPTbkfm'
            + '6NHN1vJyPZNlzmSZtZ3QtX1NR2EpKxvIOfdhjFVRy6ECvEeOxND9+w9Ier24GzoyBntNjf5WFzk6'
            + 'HKcTX0dFxVIPraaWg7FGkemznfq9yzIcNTXzSGgVUfrRR0LTZzs1nMNqNo+6G6GdpErXIGDOHAw/'
            + 'enQHxOULdeZfT7Cbzch5/vk5P3SWpaWl3VyROgAXaOXuIguVVuvQrl37hD039/54wxYL4OMDjBoF'
            + 'PPww+PDhx5jFMhpA99vtcnQHMIZU6SILldUKe3g4+Lff4ns7EGrB6WyRODCwReLw8JbHFkvLtqHF'
            + '8qP7idC2XRfsH6HRgDEGnpEB9uWXUFXT4XAATU3AmDFAWFiLyD4+LRIzBjQ33/HbSeiuhCSBnz0L'
            + 'pKcDWVng7u7ATYM/XRo3N+Chh4Bhw1oklmXAbm+R2Gq9633v/wdMNfEWwhGfEQAAAABJRU5ErkJg'
            + 'gg=='
             ;

/**
 * This constant holds the data from file 20160612o0133.slidethree.v0.p25.png.b64 (7 492 bytes)
 *
 * @id 20190315°0524
 * @type String
 */
Sldgr.Cnst.sImgSrc_SlideThree = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+MDHAsbInFoNOQAABTjSURBVHja'
            + '7Z15dFRVnse/971XVamErJA9hA4JBJpNbAKCbC7g3k4PduuoqKM4rbaj7emxbac99pmeHqdFxz6t'
            + 'R1sd11bahZZ2GbFFQXaEsAUICRASspGE7Hst7907f1QSRZZsr959lfp9zoE/WPLq3frc3/3dnQkh'
            + 'BIhBI4QAYwzrXyjErtWlYIyFXRlwLjDl0nRc//iFfeUhG0ZCD01mv8fAW/dvQ93xNigKC9+y4AKJ'
            + '42Nw5ysLwRikS01CD4Gmyg68ee9WeLp0MCoOCCEQmxKJu19bBC1ClSo1CT1Iao+24PWfbgnLFKM/'
            + 'ohJcuPedy6BqTFr5KPQ1DJzyfQ145c7NJPM56Gzy4qVbNoAxBllxkoQeICeLWvD2A9uhOanIzkdb'
            + 'fTfevHeLNKnp2xlAfthU1YE3790C1UHF1W8Oyxiqi1qw9ukCKS0ZfUP9yKx7DLy2YjOYQmnGgKVS'
            + 'GPZ+WI7DG6pJaDvJzBjDG/dtg+4zqEAGieZU8NF/7kVHk8fS1IOEPk/Tuf75QtSXtQE0ODfkMvzg'
            + 'sd2Wph4k9Dmi88miFuz4S0lYT5qYQdXBJhxcV0VCy041Vj+6E5pLpQIZJqpDwefPHAQ3hCWpBwl9'
            + 'lmZy65+PorPZR4VhEn6Pju1vHbMk9SChvxOdfd06Nv1vMRSVUg3TgoTCsPn1I31lTEJbGJ2/erEI'
            + 'imZvmTkX4AaHoXNwnVvWnA+Xr98tCXqU1kjjb6Kz7jWQ/0GZrWYDhRDQfRzuaAeSc2KRPDEWcSmR'
            + 'cMc64YpU4fdy+Lp1NFV2ovZYCyoLmqD7DGhOe+X/isqQv7oMF92UQ0JbFZ13/OU4VIc9orPh54hK'
            + 'cGHmdeMw+ZI0JGXHnLcT+20q9jdi95oyFK6vhuZUbLP2pLW2C5UHGpExLSFon4lW232Lp65cC8PH'
            + '5aYTBseo0RG44qFpyF2Qek5p+4vqjDG0N3qwdmUBjm2ttcWIjRAC067IwLW/mkk5dFALGsDxnafg'
            + '69Slfg7da+DSe6fggTVL+2TubT0G29oAwKgEF258cg5ueGI2OJcftxhjOLyhhjqFQS9oAHs/PCF1'
            + '8ZEzUsO/frAEF92UbVoHr1fsSYtScf/7l9uis+vt8KOupDVonVgSuidCH91aK60Zjk1148G/LUVM'
            + 'sntIEXkgRCdG4L53LpM+HKk6FZTuqg9aDk1CAzi+o07as6MT3bj79cVQgrzLgzGGUaMjcPMzc2H4'
            + '5fUTGANO7K2nlCOYFG+ugapZXxRMYbjrlYVQHdaNRGRMS8DsG8dDSMqpGWOoPtRMQgeTku11li+o'
            + '83sN3LRyDtwxTkuH1YQQWHL/VLiiHNLKu7PZC25QDh0Uulp8aDvVbXnePP3KsRh34RgpERIAFtyZ'
            + 'GzSp+pVOVdBY2UFCB0OsE3sbLB/d4IbAVf82Xep0dd6yLHBDTi6taAzNVZ1Bef+wFpoxhqqDTZb2'
            + '/IUQmHvzBDjdmvQZvOlXZUrrGHa3+4Py/mGfcpwsarZULN3LcdGN46UvJhJCYOL8FBi69VGaKQye'
            + 'tuAszw17oetK2ix9XtasRETGu+QfmcUYcuYlyZnqF4DfY5DQpncIW73wdfktzZ0nX5pmm/fXHCri'
            + 'M6Ik1CYELc0La6GbKjstPZ7A8HPkzk+xVRkkjo+WEqGDNe4f9kJb2SGMiHZg1JgIW5VBfGqU5fm8'
            + 'EALuWCcJbTaNFe3WRWghkDo5znZlMGpMRGAxi5VCc2DUGBcJbTbtDV7LOmcCwJjMaNuVgeZULJ8l'
            + '5VwgtmchFgltptD1Fs4QCiA+I9J2ZaCoDFaPIDKFYXSQKndYC23llLcQApFxLtuVQVerD1aPIMal'
            + 'uoNXQcNZaE+HdTtUBAciRjlsVwadTV7LO4RZsxJJ6GBg5ZYrAcDhsl9xnypts3SShxsC2XOSgzay'
            + 'Eta7vr3dfjjOu3mUBZpjgWF3nBgAQ7fffuTaI63Wdgh1gZy5SUGrRGErtOHnmPOTbCgKg+7nYEqg'
            + 'sA2dQ1EYDF2A6xxMYT0HuggwJfD/BA80ndwQ4FxA9P4yAj343r8TXAAcMAwOw8+hOex13kdtcSv8'
            + 'XqOfSm1uO5U9JymoZ4aErdCqQ8EVP58Wtq0TYwyHvqyy9FAdQxeYcU1wV/jRjpVwpCfz2fNhuaX5'
            + 'syNCxZTL00lowuzwDOR/UAZu4dJRIQRm3zA+6M8hocMtOItAP2HDnwqt3djAgfn/nEunjxLm586f'
            + 'PLHf0v2EggvMuzUHmgW720noMOPwhmocWldpae6sRahYvGIyneBPmEvt0VZ8+B97LT1qV/cbuPaR'
            + 'CwCLLrYnocOExooOvHHPFos3BAPjZo7B5Eus26VDQo/wDiAAlOyow4u3bLD8+YrKcNPKOZZuIKAD'
            + 'z0d4B/Cz/zmA3WvKLJwNDOD3Grj5mblwRFirGAk9QinZUYdP/nsfPG1+y2XmBseCOyYie06S5e9N'
            + 'Qo+Q1KK3w3Vsey02/KkI9WVt0Jyq5XeUCyEwbuYYLL578qBvHjClVaIrKUKf+hPtKPyiGvs/OYGO'
            + 'Zp/URVDx6VH46VuXSJGZhA7BCAwAnU0elO1uQNmeepTl16O1rjswaSH5GueoBBfuezdwqLqsg3RI'
            + '6BBh/QuFKNvTgLqjrTD0wFJUJlGc7xIZ58I9qy6BI0KV+pkohw4RKgqa0FDWDtWhSL0L5iztByLj'
            + 'InDfO5dCtcEVciR0iKDa8HZbIQTGfC8ad72yCEyBLVoLmlgJFaEd9vqquMGRNSsRd7++2DYyU4QO'
            + 'IRRNgSmbG03A7zUw75YcXHbfFGmjGSR0iONwKraQWQjgxt/PwcQFgUMn7SQzCR1SIZrZJEALrP71'
            + 'LjjdGqISXIhPj0JSdgxSJ8YidVIc4tOjvv1PLf+8JHSI4IxQ7RCgwRiDqjEYfo62um601XXjxJ56'
            + 'cEPA8HO4Y5zIykvEhLnJmLIk3dKlqgCNQ4cMH//XPhR+WWW7Jv7saYmA4IEjH3LmJWHmdeMwaVFa'
            + 'X8oSzFegCB0iaK7QGZBijIGpgKKqKN/biNKd9YiMd2H+7RORtywruJkZqRIayLjp1rTP7lDg7fDj'
            + 'i2cPYeWST1GwtqIvkpPQ4donVJUR8A4M3BD4v9/vxwv/tB6njreZLjYJTSmHlNamra4bL9++EV+9'
            + 'XATGmGlSk9AhFN1GGg6Xih2rSvDS8q/g7dBNuRqDhA6VCG3x8JeVFbW5uhPPLVuH+vJ2EjpsIrTG'
            + 'LL/cx0oMXeDl5V/h6NZaEjoccDhVjPQJA9Wh4L1HdqJwfTUJPeJhYVJxXSrWPL4bR7fUkNAjGadb'
            + 'A8JkUtfhUrH63/NRdaiJhB6JCCGGFaEDU9Hf+iWE7euG6lDw9oPb0dHkGdSQHk19h0K2wVgghxYD'
            + 'k7f32owxWdFIyopGbEokRo12gfUM/bU3eNBW143qw81oqe6C6mA9w4I2y2sE8Oa9W/Gz9y4f8Lpr'
            + 'EjpURjkc5/4yORcwfAZSJsZh4vwUZM9JQsa0hAH9XN1roGhTDQ6srcDxnaekb3L9Lm113Vj71AFc'
            + '/fB0itAjSmj19GE7IQT8HgPpk+Mx/ZpMTF2SDneM85sUZaBNtEvFtKXpmLY0A621Xdj4SjEOrK2w'
            + '/Aivc7ZOCsOeD8sw/aoMZEyN77cVoeWjIULZ7nqsemgHGAM0h4JZy7KQd8N4xCS5eyQe/rLM3ma9'
            + 'vqwda36zG43lHbaZoYyMc+KBNUv7rwAkdIgInV+PtU8VYNGKSZi6NOM0AYPRCWWMYcNLh7H9z8eg'
            + 'ueTPUnJDYPG/TMK8WyaQ0CMBQ+eWLiHtlfr413V49+Gdtth1zhjwi7VXBZYBnKMe07BdiGD1euje'
            + 'yJ99UTJWvLYIdoh7nAtse+vYedNoEprol+QJsVj+3MXQfYbkCM2wfVXJeTu+JDQxIDKmJuD6xy+U'
            + 'LrXgHHs/OnHOvgMJTQyYaUvHYvLiNKnph6Iy5K8uo5SDMKejuOx3eT3bwWRJzXCqtA0N5e1nrVgk'
            + 'NDHojuLVD0+H4ZcXpTWXggOfnf2uRRKaGHzqccVYxKZGSq1YxRtPUspBmMcld0+CoXNpz2+s6ERb'
            + 'ffcZaQcJTQyJKUsyEBnrlPZ8VWMo39NwRtpBQhNDZurSDGkjHkxlKM2vp5SDMAchBGb+cBx0n5y0'
            + 'gzGG8v0NJDRhnlBjxkX3rfaTQXN1FwlNmEvWDxKlpR2KylBX0kpCE+aRMy8Z3JAjtKoyNJR3nFah'
            + 'SGhiWGRMjYfhl5RHqwzNVZ2njXSQ0MSwiElySz2mrKW6k1IOwlyScmKkdUw7W30kNGEu8WnypsE7'
            + 'GjwkNGEucWlR0kY6PO1+Epowl+gxEdJOYvruCAsJTQwLAQFXpCZtebTPo5PQhIkdMzC4Rjnkremg'
            + 'xUmE6VJJtEhzKiQ0YWLKIQT83QZkHYfniFBJaMLcJj8wUyjH6IhoBwlNmEtbfbe0tCN6dAQJbWca'
            + 'KzvQ3uBBKJ3Q1nKyS1q6E518+vJVOk5X0hfR2zvXfQbK9zWieONJlOyoQ2tdN+bdOgGX/2xKyLxP'
            + 'U2WHnDOlBRCfFkVCy5a4ra4bxZtrcGRzDaoLW3oOYmRgjMHp1lC8sSakhK4uaoGiWC+0YQgkZkWf'
            + 'VrYktEWU7qpHyfZaFG2sQdupbmguFYrC+s57Pr0J70RdSSuSsmNsdZr+2Sppc1UnDJ8BRcIB6cLg'
            + 'SMo5vYxI6CDRWteNI1tqcHRLLUrzT0FVFaiOwD0mTvf5i111KshfXYprH51p+xGOoq9qpC0fjYh2'
            + 'IirORSlHMNIIrnNUFDSheNNJlGyvQ/PJTmhOFUxhcA4yejHGcOCzStsLDQCHvqwCU+S0ImOnn3mP'
            + 'DAk9DIk7m704sqkGxZtqUHmwCbrXgOpQArdWDbMJZgrDtreO4eLlE2xbDi0nu3CqpO2MyQ1Lns8F'
            + 'xs0cQ0IPl/J9jTi2rRbFG2v6onDvPSRmNr1MYdix6hjm3ZrTF7Xtlm5seeMoNJeckV+/10DuwtQz'
            + 'ruUgofvB26WjcF0VjmytxfEddQBDXxTuLxceLj6Pga1vHsOCOybaLjp72v048PfKMzq0VhGV4EJC'
            + 'RtQZf04TK/2gew18urIA5XsboLnUQF5sUbRUFIbNrxaju9Vnq4kWxhg+XVkAVWPSKtSUy9PPXmak'
            + 'bD+RIN6F1Mlx0p6vaAx/fSw/UIls4nTlwSYUbTgpLQ3SfRzTrxhL50MPle9fkgbO5a33rShoRP5f'
            + 'S6XfXCyEADcE3n9kp5SOYC8xSW6kfT+ezoce6pc4dWkGuMSjY1VNwbo/HkLVoSap5cAYwzu/2AFf'
            + 'ty7vc3CBvGVZ527RSNn+I2RMkhtpEtMOINARXfXgdrTUdEmT+bOnC1C+r0HqiIuhc8xalkW3YA2X'
            + 'H/woC9zgUj+DEMBLyzegqarTcpm/eO4Q9n5U3nO/irxW4oJrMuF0a3QL1nCZcXUmBJf/OQQPSF26'
            + '61Tflxxsmdf8Zjd2rS6Vfpus7uVYeNek874zCT0I8m4Yb4vhM8YYVv18B9Y9ewiMMdM/U+/Pa2/w'
            + '4IWb1uPIphrLb7I9V18mJsl93pSH7voeRIF2NHrxx3/4XOpZbt/tILnjnPjhry/E+LxE0yIyAKx/'
            + 'oRBfv3PcFnd8B6KzgYc+vRKRsU4S2kzW/GY3jmyusdVUtO4zkJwTi0UrJmHi/JTBJ+Y979Le4EH+'
            + '6lLsfP84ICBt0dHZKlresvG4/P7+14iT0ION0g1e/OG6v8MZab9VA4afwxmpYvKl6chdkIKx00cj'
            + 'YpTjvP+noqARFfsbUbyxBrXHWvqm9e2Eoin45bqreuoeI6HN5uPf7UXh+mpbL743/ByGnyMixoHY'
            + 'ZDfcMU5oLhW614CnU0dbbRc6mr3QHApUTbFNND5b6/PjJ2Yjd2HqwPoXJPTgo7TfY2Dl0k+hOVQq'
            + 'kCCTecFo3PzM3IFHcyqywY8wON0aLrtnivRx6ZGOojL8+Im8QY3ikNBDjNJzb8lBbHIkFUaQ8HsM'
            + '3PBEHhwR2qBSOxJ6iFFaCIGfPDkbfq9BBWIynAvMuXE8xuclDT6qU/ENXerErBgsumsSpR4mk5wd'
            + 'g6UPThvShBEJPczUY+GduUjJjQP1rc3B6VZx2wvzz9haRUJbmHosf/Zi6VPDI4W7XlsMzTn0sXD6'
            + 'FkyQWnMpuOvVRdD9lHoMFd1n4LbnL0ZssntY4/sktElSj84chRufnA3dR53EQcvs57jt+flImxw/'
            + '7J9FQpvIhHkpuO7RmST1IDB0jpufuQiZM0ab8vPoGAOTmXFNJnSfgbVPH4DDRTOJ55XZz3HHi/OR'
            + 'PiXBvNaSpr5NRgBgQMGnFfj4iX0k9TlQnQpWvLoI8elR5qZ/JHTwOL7zFN59+GsaAfl2fecCCWOj'
            + 'cMeLC+GMNP+MExI6yDScaMcb92yB38fBwrwsdB/HBddm4tpfXTDkcWYSWnZEEgK6l+PtB7ah5kiL'
            + '1E2mMmEKw/WPzcSkxWlBk5mEtlBqxhg2v3YEm14tDqu8WvdxZM9OxI9+O6vfzQYkdAhKXV/Wjvd+'
            + '+TXa6j1SrnGwCs4FIkY5cM0jM5C7IDWoUZmEtoHYW988gk2vHIHSc7fKSHo/YQgsuDMX82/PtfxC'
            + 'ThJaotRdrT589lQBCjdUD/qUfzuOXnBDYM5N2Vh4Zy6cbs2yqExC20zsxooOfP6Hgzi+8xQ0lxJS'
            + 'Edvwc7hjnchbloWLl0+AoilSRCahbSh2c3UnNr1ajENfVENRmW1zbM4FDJ+BrLwkzPrH72HSorSe'
            + '9wBk10US2oZi6z4De/52Avs+Lkd9WXtgOaVEuXuP0TX8HJkzRmPKknRMu2KsJaMWJPQIo7m6E4c3'
            + 'VKN4Yw1OFrUEIneQO5JCCHA9IHF8eiQyZ4zGxAUpyJmbbJtTo0jokI3a3zTjhs5RtrseFfsbUXmw'
            + 'CXVHW+Ht1MGUwMSFojCAASzw2zllBQPAe8TlgQssuQHEprqRkhOL1MlxSJsUh8wZo+GyYRQmoUdg'
            + 'WtKLp8OPxvIOtNR0obW2Cx2NHnS3++Fp80P3876D2lVNgeZS4IrU4I51IjLOhZgkN6ITIxCfFoW4'
            + 'tMjzPoeEJggJ0DIwgoQmCBKaIEhogiChCRKaIEhogiChCYKEJggSmiChCYKEJggSmiBIaIIgoQkS'
            + 'miBIaIIgoQmChCYIEpogoQmChCYIEpogSGiCIKEJEpogSGiCkML/A+QIomM10nG6AAAAAElFTkSu'
            + 'QmCC'
             ;

/**
 * This constant holds the data from file 20160612o0132.slidetwo.v1.p17.png.b64 (13 904 bytes)
 *
 * @id 20190315°0525
 * @type String
 */
Sldgr.Cnst.sImgSrc_SlideTwo = Sldgr.Cnst.sImgSrc_Prefix
           + 'iVBORw0KGgoAAAANSUhEUgAAAHoAAAB6CAYAAABwWUfkAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'
            + '/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+MDHAwbElL+Es0AACAASURBVHja'
            + '7Z13eFzVtfZ/+5Sp6tUqlm25yJbljk0zEKrBDgRCaKGEBEgIN5RQAwQSagIkwCUJhBBCCARCC3Cp'
            + 'wQYbcDfu3ZZlW1bvGmn6nLO+P2YkW7bv/RIkGRtrPY8eW6OZM+fsd7+r7bXXVvRCRMQ15c03gohC'
            + 'Kb72ohRYWX42pu0kFIvR/dACGYbFLQULGZ7+MRHZ808ag965guN+chuO9gCiCQ1lqnrBnzznnDtm'
            + 'xLIDdu+9+fBP5n9+/ML6+k/V4YByfGIDCmdqjNU55QTsKN1IiwKEXw/ezODMf+zzWe+ac5k58x6M'
            + 'gCVKlPLlSOOC+5wTfUlWzYWzxvb7vWu9+fA2X0dpnwzgHgMpItgiWLZg2Sr+I4Jl291/sxPviw/8'
            + '7s/3P6MVSgmRdoOjWkdjahokwEfFKX//rilU+aagkfhT4l/f+DeY//DTKDtZgZDSQHbpc5GPLpyZ'
            + 'dUDuvVdAuwz9eOkFO7rBEojZYIuOQ3NR4E5nTKaT0fk7GF+wnbL0dI7Izm7MdruXF6ekNBYnJ+M1'
            + 'TQBsEdh9LZEDoAQFob0Jjmgq2WcEO+nkzm3n4O+c3q2+lQIdqPnu7/jk6afAMgElQxbI2I0XN6w8'
            + 'qFV3MBLTTnr/nQ8itn3av6XyRGEqHc1hEzJiWLpGrsemILkZh3cz49JbyEpdR3ZbLh1tjdjG8A3u'
            + 'hpL1Ha7vvD11yJC5xampNXtfNxKzcv9WvqX04+rq3I5odKIlMjliWUPDljXSH4vFZ7JS0lsT9b/q'
            + 'IVGovABfeLaCaPFvEUAJQw3h/pInwWja/eUCgoOjv/cyxW+ORMy4Otj6HePakmfG/v6fFRV8u7j4'
            + '4AL6vxbMT1rd3LwsGIuN/t8ZCwpFVrKDYGon6x11RC2TWWktnJy7FOX5CFOPYIuXwe9diXP9BUTz'
            + '1eMqFr7fL9MCs37gDnbZ/1fKy7lgxIj/85584Yhx/8rljnSnK9US+9yNra03rW9tHaqU6hfARQRT'
            + '6XQW17NeqkHpPebBGW64suSXBPdwzgBCUsBlo+dg1EdBCe0Fij+sy8y7UxXUHXSMnvnB+xkt4fCm'
            + 'qG1ndwML6CgcTiVhZxhJCatGdysdKtSYI8lVlxa8PWl8xmJCdEBTEemrJ5G88Vxf5ryZCxrzIs8c'
            + '+/v8N7uu3xIKkeFy/cf3Ve33U+D1dv++oqlx5GNr1txQ2dl5WiBmjYiJ3aegiwguXWfrsG00SkfP'
            + 'y9pwa8FGJua8socfEgfdvfZszj75fojZqKhQN1Vbkzd33IRav5+8Pe7/K7XRn9RU44tGHZpS2SIi'
            + 'duLuR6WkLppckvTm4vx1ann2ZhVzR6pPM0efF/EdOezWrIrnhmfMxhcaakeafnZP6Y3P/ca75pE7'
            + 'itaeMuru11NndYG83ecD+FIgAz1AfnHrFiZnZW994aST/+sb+flTjs7N+Va+x4tl26qvzLlSipBl'
            + 'UdI6OOF57zm6wgv1ZQRjyd2OmUqo98C4d6mcsQElAoaS7HV22ZZrNl7UHyD3itG3L11y7ifV1a+7'
            + 'dH1Hgdf7yc0TJvx2clb2hqMWvXhJs7f98h+Y0x64fczUuV3vf6zi4REpSdsnXZHz1GtfRWj0iy+W'
            + 'cc8RUwE4f87sJ6r9/h8HYjFDgahexocigolB07AqtqkGUHvwx1ZcmV3PqYVPEu0RX4OjZjrnjf4L'
            + '6EEAdk1Rq4o+Hj/pg9+t4Yxrxx8cQJ/14QepTl0fekR29q7bJk5qAfjeig94fvIZPVVpRwdvtD7E'
            + 'dUX3f+Vx8Ee7KjltcBEA9y3/YtKShob3agKBvL7IA4gIyU6DZUPWEYhF90BUQFy8WPIWyrOkhw2P'
            + 'KSi7+yUm/3Y8OCxsQ/H6k+rkC84f98lBw+iWYJAMt5vmYJBMt/uQSnzU+f0M8np5rWJb0p83bVrc'
            + 'GAyOpQ+YbYsgBR2scu3oObQizEhp4PLip7D3cty1tiGcW/oBRjiGsoSqqap88MfjRx40cXRGAtxD'
            + 'DWSAQQk7eF7x8M6fT558xIiUlM9UH9BaAc52L5po++ROl/uz6Yik98juCGCl1FEzfVOc+ZqS3LVS'
            + '/O6L6486qBImXwdZ39IcunnixDMzHI5KO+4xfWknTSmF5neQRdLutFhCmmIO6v1H9CC6UoAeZsd3'
            + 'FqAshSiUEVNq/Mty8q9l6wDQfSlXl5YxLTvHd/moUdMync6wiPSK2SE7xpRAMajYXrMgypz6UzH3'
            + 'mkoK2Hb2hyCO+OSwRWkhe8bkP0YGgO4PuXhUSX2+13tpIsbuBavB36iTauzFagWfdmo47cE9ojAR'
            + 'MJzr2fGNGMpSKMDTxLRTvQVqAOh+kFfKy3n+Gye+keZ0brV7wWqlFB2xKINC6T1dXVGg+1nRNLnH'
            + 'oCsVB2HH+a9B1ACUJNWK8/lTGssGgO4HuWDECJRS9kl5eT9VQG/yKUoJnoB3X09NWazqLNln0DWg'
            + '7vSPARMUygzAmJdiFw0A3Y9yx+Qp72e6XFt6ex09bGKg76PXN4QVmnj2jcM9awgMUd2TInmDNWUA'
            + '6H6WIUlJz/UuzlIYMQO1jwVQdNoGIStp348YEYLptd2/O5tlNEBzMDQAdH/InzdsIGxZnzh1/cs7'
            + 'ZIBpGWj7MfVhWydo6fsyWrMJZXd0XUG0oF0Uz1O4BoDuD7mytJQhycn1QEuvBtbW2F/iMSIaIdkP'
            + '0EqIODu7ZoqSFmsgvOr32HrMmDYFgd5cw7IEtzL2SZyIGIht7gcJwU4Nd6sER1BYIpI7AHQ/SoE3'
            + 'yecwjGBvPO+obZOiXPuE5BYGMcz9MBoibr0b6NQ2nQD4B4DuR1FKiVvXw71ZsLZEyNb39a6VsF/b'
            + 'rRCcVny5Ehtas2006LP0mDEA6//uUPXS8cZUxj6MFhXGUvuxCraCjt0LRFaKxglKRQYY3c8Ssaxe'
            + 'jY2OxpZo0z5DbCqFU+3n0qIwgwmVbou4cp0Dzlh/i4i4I7bt6Q2rHZq2R4H/HipUKRza/jSIjm7n'
            + 'dHvdnRJbMgB0P8ufNm5wBGMxozdL1C5T7y7q7zEBVBTnfjSyiilc213dsNcOsVcOAN3PMq+mLl0p'
            + '5e2N1x1WMWxl76UqwND8ODTfXhoENBs8rVkIAgrqksPvDgDdzxKVWC6Q8mUZLSK0qQAx7H1c7jQd'
            + 'TCOwj+MWbSrDVWWhBAklC2NvHrlsAOh+lqKklOMtkS8dkSilULq97w5TUZS4mrD38sRtoHDTNDBs'
            + 'QClfLp1FSXc3LG1oGAC6P2R9azzrubPTd1Jv1LaIEHFEiWH1UNuIYoK3tQfPE1vPSHnlLDCjgBBL'
            + 'VesXPf4jpuXkDADdHzI2PQOAjmjs9C8Ncld45bb2zZRYLiakVPUAWikI4mbM0hGg24gC26kWt/0o'
            + 'eSC86k/51coVF9YHAnxZ+6wQRBRRT7hnrkRglNNFzLECtVclaEblRFzlIURToJTdli/LzncPGQC6'
            + 'P2V5U9NtvQmrRCDD5WAz9ftMgekpu4jG/9tDcpacCGbcEYsYIv/6o2NJXz/XANAJebl8C/etWF5c'
            + '2dk5TO8l0K50G7GtnjG0mJRmfYS1z/tNCt4qRQwghio/geqbHaPLn1i3bgDo/pCLRoyisqPzm7ZI'
            + 'am+u41AGGzyV8f3Se+jnHDNKilnTU20LmH4HmRtGxd9lCTXnOX8DcF1Z2QDQ/SX1wcDtdi83Wbpc'
            + 'UElrz412ShhidpBitner7a7ts1rdSaRtS0OJqPqJitPOH/27F7ds6fNnGwA6IbcuXnRDld8/iF7U'
            + 'dIsIna4Asre3ZcOMjEpsFe3hbYeBCY9cB3Y4vh6dqb0EcMmoUQNA97U8uno1W9vaM+fX1d1DH2y0'
            + 'Cyb7sfcMoJSQZGcxLfv9nvEzYEQnMeovgxGHLbahrPoJ6tU3t2/vl+c8rNej36+sZGZREWvnzb0h'
            + 'bNvJvQFZRPCaJttcTWDt4VnbGj/M34gfP3v2WbCBsocvB08EZaGaSlXz1PtL/6e/GrYd1oyeWVRE'
            + 'eXt77jaf7+e93XOFKIxBIdrtQA/aZmpuSjJfjXvbe9hnR0cmw/5nCqKJYMN7j6gbUKrfmiodtkA/'
            + 'v2UzIuL8yYL5H/uiUVQvBllESHEZLHWWJ7oTqW6kJyXvItls7SZ4V1uytM8uJm1DFoCqPk7bcMUx'
            + 'ZS+/9P66fnvew1J1L6ir49hBg/jw4zl3NIZCpVqiadSXvZ5SCl+KD79E94qddS7PW4goq4cTFiCZ'
            + 'k//rOtD92A5ltRWp2wC+O7OMAUb3kdy8aBHHDhrEHUuXnLG9o+NuEVG9tc1uzaA6paFnaa+tuDKz'
            + 'A9O9vEcHQRuY8uADGI1BwYLKqawv++PYd/v7uQ87oH9z9NE8tmb1lDnV1W9GLKtXKrsL0Eiuj3ra'
            + 'e7w82HRwTP6fiEGPDoJmbQmj/3YcOGzVWaD44t3MWQeiY+5hA/TtS+Lp439sKy94e+fOl2MizgSR'
            + 'e8FmyEwxWeHdHi/M7uotZSu+nbkWl9ET/DAw8ZH7cVeZYhmw+nx1+/mqoGpOdVW/P786nNi8qbUl'
            + '6fqFC6saQ6HUvoiZAToLm9hs1vToQnSsK4XrR9/EnqWBFlDwxl2cdNlFoEdpHqttm7Qor+SR2Q3W'
            + 'haeVDjC6t/LwyniN3WsVFQW3LlmyuiEUSol36e0NyILY4E0Xtrpqe3jZmZqDa4of766877LPnrox'
            + 'TL/5THBE8RWqyL2LXCfsUlkHBOTDAuhbJ01iVWPj4Gc2blizy+8v1vqAxSKQnmSwOH0jtiW7g2ZR'
            + '/DBvMTh2dS9eKOKbuKZd+QyOVreEvNjLvmXPekKNrH7rrY0HbBy+tkBfu2ABAL9asaLkp4sXf94Y'
            + 'CqVrfdQ4TtcUm7N2EpHYHnbZ4LyUJo7Ifqc7VkbAUjpTbnmZwXPSxDJttfU09cQpv544B+Dss8cc'
            + 'sPH4WsbRKxobmZydzYMrVpz8QdWutzqj0aQ+A9nWUUU+qozmOJoJUL/h9XPO0D8T7HJ8Ek35B712'
            + 'IxP/MpZYiqW2nKIeG//c+Bu/ijH5WjJ6cnY2P5n/+Yz3d1X+qzMa9fbdURAKIy/IUnPrbsoiDNZM'
            + 'flD8NKKFdqe4FbjWXcKpF14jyhZqJ6i5O14quu3NF9cxAHQv5b7lXwBwyScfP7SssfH9QCymqz5C'
            + '2bKE3EyDL5LKoasSWBTDDZP7S/6EbrTGVXaC4RnLZnDWGbdBsk9VnWzMLZptnzpLpUXPuaRsAOgv'
            + 'K2/viC/tZblc5g/mzX16c1vbrTGRvsIYEUhNU3yUuZKoWAkyC6m6cOPwv6Cbld2OlygwGqZxytl/'
            + 'ELPTpn6ituLjF10zlz3utr7KMTrkbfSja9bwraHDeGHL5uwXy8s/bAwGJ/dVjAxg20JyssaK7M1Y'
            + 'sURZiAiFejJ3jXiBFHdFfJ05YZOTV53Cqec9iqPTr6pPNT5/5HWZ8d9qeOirHqdDNmFS1dFBYXK8'
            + '9vmBFSvGzautWd0cCqm+s8dx5JKTNDYVllMX6eymbIpu89Dw10h2b+zRf9u5fRJnnfaaGC1+1Vas'
            + 'zcl875+nrnjlIiZfN4oBoHsp35839xcbWtvujNiW2ZdHKNi24EwW1uRuJSDhBJNhmEPjpmF/JtNd'
            + '2YPJ6QvO45Tz7hIjKKr8W/oL9/816aoX1NDwwTJOh6yNXlBb5z5/9kefrWxq+mXUtgytl3nrHlkv'
            + 'gax0g6V56xMgxwEtMBT3jnieNFcllnTvsiF57vky8zsPYYZh0xnqqZLnyy67/L1o+GAar0OK0e/u'
            + '3Mk3hwzhzqVLjl/a2PjX5lBomOrLg1AQxFKYWRHWZGwjZCfWl0VxgifC94f9HofZjh3f2YqlYPiz'
            + 'd3PM9RfjzwtTd7R+zYgXxj51MI7dIQH0ppYWRmfE90XdsHDhTfPrah+2e7mOvL9kiEKRV6jxrnP5'
            + '7hAKYYZXuHzEr7GIdHvWFjD+wbeZeN9wAjmWtfgOc8bJV5d+vKa5mfGZmQfdGB70Xvcvl3/B6IwM'
            + 'nly3btDs6uo/za+rPdMWoS/PwxQRvLpJ+6Bm3nXuiIOsBN02uXLQWk7Pex0/Fiphj6V9FN+46hEp'
            + 'emu4qptqr3r7aeP8q8eVbl169/qDEuSDntG3LF7MI0cdxQMrV5R9XFW9tD0ScQsiqs/scRxkp6mx'
            + 'q6iSKmndzQA7mYeHv0Vu6ny6+/IrMGtP45xJj4rZYan1V5pLy54oPRLgvWfWMuuqcQftWB6UQN/9'
            + 'xTLuPWIqImJcMGfOr6oCnTcHY1afn0anbIUnVVifuZ1mLdGH01ZMcMENw17H6VqHnfjGCIrhL/9E'
            + 'pt9wtQqkWbL+m9x41KPjHxfmojjxoDd/B53q7jqa8Pktm0ee8t57n7eGQ7kAWh+yGOIn2qQPEj5L'
            + '2pDYsK7A1vheWpTTht2XeE/C4bacTL/uVUa+OExVT7PbtzyaNvGk8UU7Pnp4NerWCYeEI3vQMHpj'
            + 'aytj0tMREfPc2R/9oCkUerIjGtX6msUigsvUieT6+MK1FWwdUGQoJ1fkLeWInDfjB5HFyU3Sxukc'
            + 'ecNvyVmdRM0E67Ub/8Xlr6vxgQ937eL0wYMPmYjloGD0H9avY0x6Ojt8vrTTP3h/TlMoNFlEVJ+z'
            + '2BayvS7W5G2hjvaEZy2UODRuGfE7PI4aouwOnfLfvl1OuPoiAm5bVl/OOW//Oumd11WxAIcUyF85'
            + 'o/+2eTOXlZQgItrVn392WbnP91xzOIzex1WRIoJTM7AzAqzKKCcciwEKE4Mz06q5uOglQpqvO8ul'
            + 'txYz4WePyphnx6jmSaElz79vXn5TTumml7Zu5bsjR3IoylfG6OZQiEyXCxHJnvnhB281BoPH2CLo'
            + '/aCqk0yTHQU72aW3ILH45T3i4P4R7zIoeVG8WEDiLE6eexWzrrqaWMRU666K3vrMU/LoE6rU+uDp'
            + 'dZxxiIL8lTC6IRggx+1BRNTl8+aevbOz8x/tkYijP2yxqXSspDDbcytptjvjlxcHx6c0cv3QVwjp'
            + 'tUgXi/05jHryJpl8/5mqsTiyccO93h+ceNbIxctvWseU35ZxqMsBZfRTG9aR4/awqbUl86x/ffhO'
            + 'XTB4pGXbWl/bYhHB1Aza8xvY5qyLryGjSJFUbhn2JsWpiwipWHds7Fx7Jqd9/yZx1Wertd+171lw'
            + 'lv3wNTNHBr74ZwVTvl3M10EOCKPvW7GcuyZPoT0Y1H+5csV5a1paXm4Jh9H6wRYrFIbHoj6/jh3S'
            + 'CKKh4WCs28ctQ19Fd27fXbwXSaXotZvkuKsvUx15vqolDzpuOPW80W+89+pGZp0/hq+T9DvQ/6ra'
            + 'xYzCwSxrqM+9d8WK9+qCwSmWbaP6QVWnaC4iBW0sc1QkKkEE3fZyW+FCxmXOxtbiW1otwF19At+4'
            + '5H5JXZ2mKs/Unll4s3bbZePHtPI1lX4D+oUtW7h01Che3Vbu/aSm5pK1LS1/DMRi9Ict1pWG7rKp'
            + 'L6hlu10PSgfRKHPAbSNeQHeUd9tiFUmRwteu5fgrLlVtI8MNi35mXjrzktKP+JpLnwPdFAqQ9fO7'
            + '4De/5d7lXxwzr7b2qY5odHyCxX2uqk2lExnkY5OniiBhEIXLzuC6wo8Zn/URSgt1bYfCtfk0jr/6'
            + 'p2RuHsrGGdGHl1zKQ1eePL5l7u/Wc+K1YweA/nfk05oaTsjPj8fHWzZ7F9TVPbC2tfX6UCzWLwAr'
            + 'pfA4darzq6hQDSAaCo0SZ5jbi1/EcO7stsUq5mDwmz/l2B/9CH9mR9Ps+/Tzz72obO7rb67jO+eU'
            + 'cThInzP6pwsXXrequenmtkhksOrDIr3u7JYIqZqLtpwmNidVE5R4K0Y3bn5c8DlTM+dia8FuW+zZ'
            + 'doZM/9HNKmVdHg3H2b997jX9wXvUmBYOM+kVCC9u3cwlI0sQES6fNzcjaFlztra3T+oPgEUETSlc'
            + 'LsXmggoabV/i9hUTHE7uHPEsUUd5/L2ACiVL8XP3q6NuOI2aIyMNS/+YdNI5Y4ev/6ymhuMTmudw'
            + 'ki8dR/961cpukC+YM+e/a4OBH3VEo86+zmx1sdhrmLRkN7HJW0+nhAHFYLL47uD3mJI5hwix7uxW'
            + '1ueXybS7LlPuysLY1gtiv3j5b9mP/0LlB+a+uuWwBLlXjP7Tho2qMxY5993Kypdaw2FT64dd+109'
            + 's9O8BuX5O6i0WgGFUsKJHuGKEY8gKri78kNcUnbHC2ri70vZMS22afbTjhN/OHJM3bObNnLF6DEc'
            + 'zvIfoXPjooU8evQx3LF06ZRVzU0PNIdCM6L9FBOLQIrTpCG7gS2eGizLAtEY5TC4MP8DJqQvoKsq'
            + 'PgQMe+MamXbnFSqmu1p2nSx3jvtd2R8ZkH8f6NfKyzlvxAje2rGds4cO46pP5z2yuqXl5pht94sd'
            + 'hniXn6R0YXnmFjqtcOI2dX6cHuTEIQ8TIbb75ptHyEmX/03lLPKy7nztxfFPln1fKRUbgPY/ALol'
            + 'FCLDFT+i54pP511REwg8WOv352jxjgF9r6ZF4U1S1Gc0sM1Vh2UJ2F6OTanlwkGfkp20gsTiE3Yk'
            + 'l7F/vEpKfvc9FUwPL9t8tvr59DvHfgSwzdfO8JTUAXT/HWfswZXLyXC5eHbTxsJXKypmr2xqGg2g'
            + 'a1qfO1sigolO8uAY85wb46U9Npji4J6hCyhKfwelbGKJxIdjzUWcfdmthAOaqjgn+uPaezOemeHO'
            + '797ENgDyf8Dov2/dmvX69oobW8Lh232RSJ+nLrsAdikDOzVMVUYdVaoRRMcpyczM2MoF+e8hZhW2'
            + 'QFRB0vapjHv8Goa8cTQNI8Mvzp6b/osrVFHFAIz/IdCPrlnDjePHc/eypVd9Vlf3VEc0qieyUP0S'
            + 'MqU4HOzK38UOrSl+GJgoJphurh/xexyOXd0b2Gyg+KnH5ch7jlc1Jfqupgvcp7wxs3PrA8Mmy1s7'
            + 'dnD20KEDSP7/gK71+8nzegG4bsH8oys7/b/a2dlxQiLp0afZM0l083GaGlZ6gA1pO/HbYRCdfBPO'
            + 'yVjDiXlvEcKKryKiMWjJLJl4yz0qdbu7peKM2NND/lR2V7JS1hcN9RyRkzuA4H/CaBHRzpsz+6+7'
            + 'OjvPj9q2M+H69nl+VGwYkuVibtp62gjEd5hbDi7J9HFq4bOYRlN3HbXlK+GUq54ge/4gVn1HvWJO'
            + 'Tbp60qXFbQA73qtl6Ky8AfT+E6Cv+HTeRbs6O59tCAbd/eVNa8SXEUPZPlY7d8Q9KnEzztPIj/IW'
            + 'kJOymEjXAkQom8GvXszke65BnJENC3+qbprxw7EfCvBJVRUnFxYOoPZlgJ765j8ty7Y11U/OlikG'
            + '5Hey1l1JQIVAFEm4+dmQuRSlzkXX4q3XLMCz8Qdy2sXfV8qfzqYzubz2UtcbZ00c0TkAUx+EV7aI'
            + '1td7mQB0pWGm2NTmVrLdbgDRcWFyYkoDVxW9R8ioQIAY4N1VKqUP3adGvlBm1U0Nv3vsCs/3KlWx'
            + 'b/7NtQMI9Xcc/eWBhnS3ybbcXdQarUTsGNhOjnE7uXjI02S4txPARgEh8TD5kQel5KnpqrHEvW71'
            + 'dbGLj7hv3BqU4tmNG5meN2CH+0x1T/nnG9I3LFZoOngzLZakbiZkRQGTTCPEFZkVHJH3cnd/TMQk'
            + 'adUpMv3aR5R7B627vqU9MfrJ0l8CfF5by3EDAB98jBYRdNHJyFYsTy6nSfPFDa7t5aqcnRyV8wZe'
            + 'Rz3RxBKio/oojr31LjK+GKrqxtqPLbnH8disU0p2dV1vAOSDDOh4IYCG5hCsghb+pW0H0dFEp8xp'
            + 'cdOw53C4NmEBMRRGRxpFb9/A9GsuoHlEuP3dx2TWhbPGLeDNARAOWtVti+DSDNpym6n2NOIjAKIx'
            + 'SHm4beg8hqa+TzThSVsAwUyGv3gtw/4+k9xNg6A96rc8VqNtRhubR1ittsjC1qPNrU9d3TH3DyOP'
            + '3McD29rWxsi0tAG0DiTQIoLHNDCKO/g0XIGhNGxlYytBsMF2MNp0UpJcQal3J0XJa9H1ZnQjjIFF'
            + 'DPC0TyFvdhnZq48i75Mx4qkzlBZyoMVMOgoddJixLxyp5sLNk2KfTdnpXrIdv9+tmeE//F2LPKbG'
            + '9FiC/Ed5OReOGDGAZH8wOl4YoHAZGmLY+PUQMcPCdkYJO8IEnCGa9QCWHQHbgVdXZBhtZDpCZBgt'
            + 'DPW0UejZxdCkZrxUY+DC2JmHpzFLtJ3Dydg+SqWsHkPW6iF4GwqJEfGZUasymBlrDHpiW/3jzZ3b'
            + 'MsOfv/pY1san1eCmPe9tbk0NJx6m5UL96nV3Z1lEEoc6xhuvaUoj2atodLWDN0q12UK7HUKU7D78'
            + 'UcBlpzI6uZoyTz2l3m3kJ2/F1pvRVDzfbeMmZf3RDFp1JNkfTGTwymEYLaDZBlpEp3G4ZplJ+sIN'
            + 'pZGPXUckzS28z7dcFZn2lrN06/ObUqK3q8Iez7dnx8EBoPsA+O5qEVEIYKKhO8Cvh1CmTdAIE3VG'
            + 'CZhBOs0InVoo3kvCdpNudjDIESTNrGew0yLXvYPCpEbyHHW46UDzpeFuKMIsLySlcghJm0aRuXko'
            + 'ns2luMIOjM5YVTDbro8RKQ8OVtuDurWq7XRXxaQbC1ahkvY86oK/bd3CZSNHDQDdX9IVe3d1vU4x'
            + 'TMKeEFFPiJ1mM0FnEL8d2evoV0Wm8jDJ08LIlA1M8jThSlqQWICR+IpXOI+ctceT9+5YcjaeKAVz'
            + 'PEo0DWUr/B5Qgx3tVWmRd7Pcrs/ev5dPZ10R3dYyFAkki/3BM9nyM9UzvJtbXcWJBYUDQPc58BKH'
            + '36OZBMwQOCw6jTAxM0LYiBByhAmbMXziB1tD4abAESbHUUOes4McZz153mYGuRsZpNcQxiKlpQjH'
            + 'liJSKweLc/MYlVmRh7tiFEnbc3CEHRJ1WxVa1NoQGmRVtaXGNqhhrsr3Z/hX//iCKTv3vs/Vzc1M'
            + 'OEh7iR0SQO9P9XctlApdB9HEb9USweswMJMsdjqacSZbbLLq2PegMGG0lklxykqO8HQyPGUlhnNb'
            + '9wnRAkL4CJXz3mTyV00j94OJZFU4petom6gXVT/EXmUXGEtWHRv7XJgJHwAAByVJREFUqOz60R8N'
            + 'V64eiyz1gQC5Hs8A0P3BfKVUopgQNDQsO96+IuaMEjCCWI4YHUaQgBHGckTp0GNE7RDYDpJ0D7mO'
            + 'KorcnQwyG8h1N5HpqSPTVU8mPsCBs6KEtMoinOvGSPaWbOXcNYLUbYPQfflosVhANHt9MNeusK3I'
            + '2kievrNVi2784u+pdZenFlcPAH0ggO+2+YnXujQAQmGSlwqzAfFGaHK20yQdXfECGoKmBIcYjHFa'
            + 'jEuqozh5OaVJ9cT0KsRWYGmI5cS1bQp5K48i46NpFK6biGdzxMYQC0SqR8ZsV5K5uLrQ+rjzONe8'
            + 'Y68umT8A9AEWWwRNVMIPUKS5THxGgIAjSNgRodMIYhkWHXqIkG4hlg1ikmEIQ9ztFDiqKPTWk+6s'
            + 'JdPdTrrRQhIBrGgu2ZuLcK4rI3PjcPFUFKiUyizcNflEjBScAakLZNlblD+2KDqUXc1adHNksrNu'
            + 'gjd3q7ojMzwAdD97AiKwZ7FUvFuzxLWABprbQrxRmh3tdLoDNMU6uzWGoWwMZeNGMcEdZFTyZiZ4'
            + 'mxmUtJKwhCDiRMUMYqE0ydhxtMqaPZXi+WWkLy0C245qosy//yxcdsmtU9cfMKAnvfF6fJ4n1J9S'
            + 'isNZpPto4HjiR4lCR6G7BMsVocMMEnWGqTd8dJj+xKYvPdHb2cMlBcs4I//l+ERKHItlA9mfnsHp'
            + 's34DZkyC6ShPxXitP0+A31u0Qq93u0vXidl2t4rreliRw4/siXMr4w68Bmg2Mc0iHBEsn4mnOYXU'
            + 'mmyKQ7m7QwTNAi0Gpo9ko7ZbQySmCwrIXnMcxPc+qLYMqUYpWVxff8Cey3jn9DOKAZ7bvKnszR07'
            + 'SnWlTmgMhUbGbDtXRNKVUoOitm3uBbooUNIPlaIHFegJxNR+Xq/T2nuGc4nMzxB3535DxoxPxsa7'
            + '1iE4XcYqgKNyD1y5sgHw540b+X7J6HXAOuBVgEdWr3J/XlfnCVlW0oSMzCGb2tom2SIn+yKRiSEr'
            + 'NjgmsucJ6PGperiofQW6uR80UeQ7avYyBXFW5GwYBypu5xtyrEUH+pYNgCvH7Lt3+JYJE4NAcFVT'
            + 'U/PErKydwGfAfydUuuv6hQsmNAZDx9WFgmVhyxpvi6QJpCGSGhPR9tQACr42xl9EECX4Eq2s9kTa'
            + 'g4tUZw0d0vMU+JhdhHeLIOlg60JBi7nkKwH6/5KJWVk9fv+spgalVAhYkvhBRPj5sqVpW3y+1M5o'
            + 'NCXZNIfGbPsbHZHoVDR1XFMwqPZgP9ohjLlSiigWOOy4l7XHdJ7oaevuDtwd1gGFK8eDEV+Nsxwq'
            + 'UpcWbdrQ2kJpesbBA/Tesr/WEAmytgFtv1+3jp+Ula0F3tmDBd4fz//8pBp/4EilOK3K708zlEoR'
            + '8AJJUdvuMTgHcwRgi5DmdtApgZ7DJxqlyRXxipq9bjtp3jFgxhfNlOALZWvN4w8gyF8K6P+f/KSs'
            + 'Zzunja2tKKX8CeDfAX4uIvr1ixbl7PT50v1WLKPQ451SHfCPB44OWdaY9kgEQylsia9IKaVERA4K'
            + 'H0CJIuwJxA3vnvZZFOO99cT2Y7qLVpWCYSVidNX5P8+YbfyZQxvovWVMevr+NIAF1AK1s6uqOLWw'
            + 'sEeqcFljw8QHVqwYY+j6NxsDwXH+WDRb0zQ3Im4Bh713BNAf20z2b6BRaLS6Ovf6NgFcZCQv7Y6f'
            + 'd6tuL6mrk+MH79iK9jRp/Lka3XHQ2ej+llP32kv1ekUFU7NzVgGrgJcB1rW1Jj2+ek1ubcCfIzAo'
            + 'JlLm1LTjWsLh4YamFfsikd2OL3RvPekHA41Y0O7ujNcuq932Od8RwSaMvtc3e5uSMUOO+FttITrc'
            + '2MT6Az/OB93hKd8p3rdtcllaeifQCWxLvNSjSPi/5n8+tjMW+3ZDIDAtZNvH+CIRXYEDcAjosj8N'
            + '8CV8ABEhy+Vmhd0W7ze6h2Q6qlB7lUmIgKM1Fy3k7Z4om7ODH34V43rIHysM8Ifpx62H3Tx5asP6'
            + '9E9qagbHRIa0hkK5SaZ5ZHMoNNRjGMf6IhF31LbRevoA/DuqX6FoMTv2806h0BnZN7GiEGdNpnJ0'
            + 'OBBloSyofihjLc8OAN0n8uPSsa1AK7Am8dKf92Cl645lS2esbm6eZovMaA6FRtugK9ABHRFN9vWn'
            + 'VNdkMN1ixyHsSobHp0CGWR9RED/zBQxBFAqFXlRTM8J25W9VnsaR4rokq3jtK9u2ccHw4Qc+y3e4'
            + 'SHVnJwVJSfu8fteypYPLOzqKGwOBAkPTSiK2PUbB+JBlDQvGYo497D8ZacYz27J3LsRWJWEtWmpZ'
            + 'MkZ0GTncGnntLUXr3m1kUVFGcuXwzrA53O3smNwaLfzLNd65rz8kO3On392Reex9ZRsYkK9W5lRV'
            + '7fPa57W1Q7778ZxLzp8z+/UzPni/6tsf/euc+bX738575Kq/AlDr9/d4/dmm737lz/b/ACm8zRn5'
            + 'ly14AAAAAElFTkSuQmCC'
             ;

/**
 * This constant array provides a fallback slideshow
 *
 * @id 20190106°1421
 * @note Must be located behind the image data definitions
 * @@type Array
 */
Sldgr.Cnst.aFallbackShow_One = new Array
               (  Sldgr.Cnst.sImgSrc_SlideOne, '', 'Slide One'
                , Sldgr.Cnst.sImgSrc_SlideTwo, '', 'Slide Two Zwei Deux Due Dos δύο два दो दुई 二 Mbili দুই ສອງ දෙක இரண்டு రెండు สอง နှစ် ʘ اثنان'
                , Sldgr.Cnst.sImgSrc_SlideThree, '', 'Slide Three'
                , Sldgr.Cnst.sImgSrc_SlideFour, '', 'Slide Four'
                , Sldgr.Cnst.sImgSrc_SlideFive, '', 'Slide Five'
                 );

/**
 * This constant array provides a third button set
 *
 * @id 20190106°0941
 * @note This must be placed *behind* the used definitions, otherwise
 *    the array entries will all be undefined.
 * @note Formerly, we had this were not embedded images but linked images. The
 *    only difference is, that with the linked images the script-folder-relative
 *    path has to be prepended. Otherwise the exchange is straight forward, e.g:
 *     • linked   : Sldgr.Cnst.s_ThisScriptFolderRel + 'img/20190104o2131.kdeleft1.v0.x0048y0048.png'
 *     • embedded : Sldgr.Cnst.sImgSrc_KdeInfo1
 * @type {Array[String]}
 */
Sldgr.Cnst.aControls_Shiny = new Array // revamped 20190315°0511
               ( new Array
                          ( Sldgr.Cnst.sImgSrc_KdeLeft1
                           , Sldgr.Cnst.sImgSrc_DrawArrowForward1
                            , Sldgr.Cnst.sImgSrc_DrawArrowBack1
                             , Sldgr.Cnst.sImgSrc_KdeRight1
                              , Sldgr.Cnst.sImgSrc_KdeInfo1
                               )
                , new Array
                           ( '' // Sldgr.Cnst.sImgSrc_KdeLeft2
                            , Sldgr.Cnst.sImgSrc_KdeStop1
                             , Sldgr.Cnst.sImgSrc_KdeStop1
                              , '' // Sldgr.Cnst.sImgSrc_KdeRight2
                               , Sldgr.Cnst.sImgSrc_KdeInfo2
                                )
                 );

/**
 * This ~constant tells the marker for one SlideGear div
 *
 * @id 20190106°0531
 * @type String
 */
Sldgr.Cnst.sPlate_DataSlidegearAttrib = 'data-slidegear';


//~~~~~~✂~~~~~~~~✂~~~~~~~~✂~~~~~~~~✂~~~~~~~~✂~~~~~~~~✂~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~ Schnippel ~~~~~~~~~~~~~~~~~~~~~~~~~
// summary : This area is shared via cutnpaste by those:
//            • dafutils.js • canvasgear.js • slidegear.js
// version : 20190329°0221

/**
 * This namespace shall be root namespace
 *
 * @id 20190106°0311
 * @callers
 */
var Trekta = Trekta || {};

/**
 * This namespace shall provide some general basic functionalities.
 *
 *  The section between ~~~ Schnippel ~~~ and ~~~ Schnappel ~~~ can be cut
 *  and pasted to other scripts to provide them independent standalone basics.
 *
 * @id 20190106°0313
 */
Trekta.Utils = Trekta.Utils || {

   /**
    * This function retrieves the filename of the page to be edited
    *
    * @id 20110820°1741
    * @note Remember issue 20110901°1741 'get self filename for default page'
    * @callers • 20120827°1511 getFilenamePlain • 20150411°0651 featuresWorkoff_1_loopAll
    *      • 20150515°1241 sitmapWorkoff_process_Cakecrumbs1 • 20120830°0451 editFinishTransmit
    * @returns {String} e.g. 'daftari/daftari/login.html' (with Firefox)
    */
   getFileNameFull : function() // [Trekta.Utils.getFileNameFull]
   {
      // read URL of this page
      // Values are e.g.
      //    • 'http://localhost/eps/index.html?XDEBUG_SESSION_START=netbeans-xdebug#'
      //    • 'file:///G:/work/downtown/daftaridev/trunk/daftari/moonbouncy.html' (not yet working)
      var sUrl = document.location.href;

      // remove possible query after the file name
      sUrl = sUrl.substring(0, (sUrl.indexOf('?') === -1) ? sUrl.length : sUrl.indexOf('?'));

      // remove possible anchor at the end
      sUrl = sUrl.substring(0, (sUrl.indexOf('#') === -1) ? sUrl.length : sUrl.indexOf('#'));

      return sUrl;
   }

   /**
    * This function gets the plain filename of the page, e.g. 'help.html'
    *
    * @id 20120827°1511
    * @callers E.g. • dafdispatch.js::workoff_Cake_0_go
    * @returns {String} The plainfilename, e.g. 'help.html'
    */
   , getFilenamePlain : function() // [Trekta.Utils.getFileNameFull]
   {
      var sUrl = Trekta.Utils.getFileNameFull(); // e.g 'daftari/daftari/login.html' (in FF)

      // fix issue 20181228°0931 'slideshow fails' [seq 20181228°0935]
      if ( sUrl.indexOf('/', sUrl.length - 1) !== -1 ) { // 'endswith' replacement, see howto 20181228°0936
         sUrl += 'index.html';
      }

      var a = sUrl.split('/');
      sUrl = a[a.length - 1];
      return sUrl;
   }

   /**
    * This helper function delivers an XMLHttp object
    *
    * id : 20110816°1622
    * ref : 20110816°1421 'first simple ajax example'
    * note 20150515°173101 : This function seems to work even with IE8
    * note : Any AJAX request might be easier done with jQuery, e.g. like $.ajax()
    * callers : • readTextFile1 • MakeRequest
    * note :
    */
   , getXMLHttp : function() // [Trekta.Utils.getFileNameFull]
   {
      var xmlHttp;

      // () seqence 20150515°1612 'browser switch'
      // note : Heureka, now we can read the XML file in dafdispatch.js.
      //    This solves issue 20150515°1411 'jquery get() fails in IE8'.
      // note : We do not use variable Trekta.Utils.bIs_Browser_Explorer anymore,
      //    so this function can be used without .. daftari.js, e.g. in fadeinfiles.js.
      // note : Tested only with IE8, not yet with any higher IE version.
      if ( ! Trekta.Utils.bIs_Browser_Explorer ) {

         // Firefox, Opera 8.0+, Safari
         // todo 20190209°0836 : Implement feature detect and notify if not
         //    available. Then it will be different, what exactly the XMLHttpRequest
         //    object does handle. See ref 20190209°0853 'MDN → Using XMLHttpRequest'.
         xmlHttp = new XMLHttpRequest();

         // [seq 20160616°0231] experimentally preserved from throwaway old sequence
         // note : Does it make sense to keep this sequence here? Not really.
         //  It might make a bit sense, if we distrust above condition from the
         //  DafUtils library, and we want make our own opinion. And second,
         //  this statement is may ubiquitous appear in JS, like a watchdog,
         //  or perhaps like human speakers often use 'aeh'.
         var bFlag_SnipArchival_NaviAppNamExplo = false; // flag 20160616°0251

         // () condition 20160616°0241
         if (bFlag_SnipArchival_NaviAppNamExplo) {
            if ( Trekta.Utils.bIs_Browser_Explorer ) {
               throw 'The browser is IE';
            }
         }
      }
      else {
         // Internet Explorer (IE8)
         // todo 20190209°0835 : Switch off this sequence, this seems
         //    to be for Internet Exporer 5 and 6.
         try {
            xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
         }
         catch(e) {
            try {
               xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            catch(e) {
               alert('Sorry, your browser does not support AJAX [message 20160613°0421]');
               return false;
            }
         }
      }
      return xmlHttp;
   }

   /**
    * This function escapes a string to be used as HTML output
    *
    * @id : 20140926°1431
    * @callers : • Cvgr.Func.executeFrame
    * @todo  In FadeInFiles seq 20151106°1822 and seq 20151106°1821
    *            shall use this function here. [todo 20190328°0943]
    * @param sHtml {String} The HTML fragment to be escaped 
    * @returns {String} The wanted escaped HTML fragment
    */
   , htmlEscape : function(sHtml) // [Trekta.Utils.htmlEscape]
   {
      sHtml = sHtml.replace(/</g, '&lt;'); // g = replace all hits, not only the first
      sHtml = sHtml.replace(/>/g, '&gt;');

      return sHtml;
   }

   /**
    * This function tests, whether the given script is already loaded or not.
    *
    * @id 20160503°0231
    * @status
    * @callers ..
    * @param {string} sWantedScript — The plain name of the wanted script (not a complete path)
    * @returns {boolean} Flag telling whether the script is loaded or not.
    */
   , isScriptAlreadyLoaded : function (sWantedScript) // [Trekta.Utils.isScriptAlreadyLoaded]
   {
      var regexp = null;

      // build the appropriate regex variable [seq 20160623°0311]
      // note : See howto 20160621°0141 'programmatically build regex'
      // note : "/" seems automatically replaced by "\/"!
      var s = sWantedScript.replace(/\./g, "\\.");                     // e.g. '/slidegear.js' to '/slidegear\.js$'
      s = s + '$';
      regexp = new RegExp(s, '');                                      // e.g. /dafutils\.js$/

      // algo 20160503°0241 (compare algo 20110820°2042)
      var scripts = document.getElementsByTagName('SCRIPT');
      if (scripts && scripts.length > 0) {
         for (var i in scripts) {
            if (scripts[i].src) {
               if (scripts[i].src.match(regexp)) {
                  return true;
               }
            }
         }
      }
      return false;
   }

   /**
    * This function loads the given script then calls the given function
    *
    * @id 20110821°0121
    * @version 20181229°1941 now with parameter for onload callback function
    * @status works
    * @chain project 20181230°0211 http://www.trekta.biz/svn/demosjs/trunk/pullbehind
    * @note About how exactly to call function(s) in the loaded script, see
    *     issue 20160503°0211 and seq 20160624°0411 'pull-behind fancytree'.
    * @note See howto 20181229°1943 'summary on pullbehind'
    * @callers
    *    • dafstart.js::callCanarySqueak()
    *    • daftari.js seq 20160623°0251 'pull-behind slides'
    *    • daftari.js seq 20160624°0411 'pull-behind fancytree'
    * @param sScriptToLoad The path from page to script, e.g. "./../../daftari/js/daftaro/dafcanary.js", 'js/daftaro/dafcanary.js'
    * @param callbackfunc The callback function for the script onload event
    * @returns Success flag (so far just a dummy always true) e.g. function(){ DafCanary.squeak(); }
    */
   , pullScriptBehind : function ( sScriptToLoad
                                  , callbackfunc
                                   )
   {
      // avoid multiple loading [seq 20110821°0122]
      if ( Trekta.Utils.isScriptAlreadyLoaded(sScriptToLoad) ) {
         if ( Trekta.Utils.bShow_Debug_Dialogs ) {
            alert ("[Debug]\n\nScript is already loaded:\n\n" + sScriptToLoad);
         }
         callbackfunc();
         return;
      }

      // workaround against workaround [condition 20190329°0151]
      if ( typeof DafStart !== 'undefined' ) {

         // bad workaround for s_DaftariBaseFolderRel mismatch [seq 20190211°0131]
         //  The reason is, that s_DaftariBaseFolderRel is the folder where
         //  the calling script resides, not the Daftari base folder.
         var sScriptSource = DafStart.Conf.s_DaftariBaseFolderRel + sScriptToLoad;
         if ( sScriptToLoad.indexOf('showdown/showdown' ) > 0) {
            sScriptSource = sScriptToLoad; // e.g. "http://localhost/workspaces/daftaridev/trunk/daftari/js.libs/showdown/showdown.min.js"
         }
      }
      else {
         // call from CanvasGear [line 20190329°0152]
         sScriptSource = sScriptToLoad;
      }

      // prepare the involved elements [seq 20110821°0123]
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement('script');

      // set the trivial properties [seq 20110821°0124]
      script.type = 'text/javascript';
      script.src = sScriptSource; // DafStart.Conf.s_DaftariBaseFolderRel + sScriptToLoad;

      // set the non-trivial but crucial property [line 20181229°1932]
      // note : Remember todo 20181229°1931 'make pullbehind state-of-the-art'
      script.onload = callbackfunc;

      // ignit the pulling [seq 20110821°0125]
      head.appendChild(script);

      return true;
   }

   /**
    * This function reads a file via Ajax
    *
    * @id 20140704°1011
    * @status productive
    * @note 20150515°173102 : This function seems to work even with IE8
    * @note Remember issue 20140713°1121 'read file via filesystem protocol'
    * @note Remember todo 20150517°0121 'implement local file reading after Dean Edwards 20150516°0612'
    * @note This function does now work via filesystem protocol with Chrome.
    * @ref http://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript [20160611°0341]
    * @ref http://stackoverflow.com/questions/6338797/jquery-to-load-text-file-data [20140625°1731]
    * @ref http://stackoverflow.com/questions/18440241/load-div-content-from-one-page-and-show-it-to-another [20140627°1111]
    * @ref http://stackoverflow.com/questions/14446447/javascript-read-local-text-file [20140704°0842]
    * @todo 20190211°0151 : Make all requests asynchronous (param bAsync = true).
    * @callers
    *     • Func 20190106°0615 slidegear.js::o2ReadSetup_ImageList : *.json
    *     • daflingos.js::getLangFromCrumb                    : sitmaplangs.json // fails with async
    *     • dafsitmap.js::sitmapWorkoff_process_Cakecrumbs1   : sitmapdaf.xml
    *     • fadeinfiles.js::fadeInFiles_fillBehind           : given textfile
    *     • fadeinfiles.js::fadeInFiles_fillPre()             : given textfile
    * @param sFilename {String} — Path to file to be read
    * @param bAsync {Boolean} — Request flavour flag (prefere asynchronous)
    * @returns {String} The content of the wanted file
    */
   , readTextFile1 : function(sFilename, bAsync) // [Trekta.Utils.readTextFile1]
   {
      // () preparation
      var sRead = '';

      // () use a wrapper instead direct XMLHttpRequest
      var xmlHttp = Trekta.Utils.getXMLHttp();

      // () set request parameters
      // See issue 20180304°0611 'Synchronous XMLHttpRequest deprecated'. But
      //  async = 'true' works not for all, see issue 20181229°1911 'make async work'
      if (bAsync) {
         xmlHttp.open("GET", sFilename, true); // [line 20190211°0147]
      }
      else {
         xmlHttp.open("GET", sFilename, false); // [line 20180304°0614]
      }

      // () probe the ongoing
      xmlHttp.onreadystatechange = function () {
         if ( xmlHttp.readyState === 4 ) {
            if ( xmlHttp.status === 200 || xmlHttp.status === 0 ) {
               sRead = xmlHttp.responseText;
            }
         }
      };

      // () finally perform the request
      try {
         // If file to read does not exist, we get exception "Failed to load
         //  resource: the server responded with a status of 404 (Not Found)"
         // See issue 20181228°0937 'try to look for file but without error 404'
         xmlHttp.send(null);
      }
      catch (ex)
      {
         // note 20160624°0131 : To test below error messages, browse pages
         // - file:///X:/.../daftari/manual/fadeinfiles.html with Firefox
         // - file:///X:/.../daftari/manual/slideshow.html with Chrome
         var sMsg = "<b>Sorry, some feature on this page does not work.</b>"
                   + '\n File <tt>' + sFilename + '</tt> could not be read.' // [info 20160622°0131]
                   + "\nYour browser said: "
                    + '<tt>' + ex.message + '</tt>.' // e.g. "A network error occurred".
                     ;

         // ref : screenshot 20160911°1221 'Chrome debugger showing exception'
         // ref : issue 20150516°0531 'Chrome cannot load local files'
         if ( Trekta.Utils.bIs_Browser_Chrome && (location.protocol === 'file:') ) {
            sMsg += "\nYour browser seems to be Chrome, and this does not read files via file protocol."
                 + "\nThere are two <b>solutions</b>: (1) Use a different browser, e.g. Firefox or IE"
                 + "\nor (2) view this page from <tt>localhost</tt> with a HTTP server."
                  ;
         }
         else if ( Trekta.Utils.bIs_Browser_Firefox && (location.protocol === 'file:') ) {
            sMsg += "\nYour browser seems to be <b>Firefox</b>, and this does not read files"
                 + "\nwith a path going below the current directory via file protocol."
                 + "\nThere are two <b>solutions</b>: (1) Use a different browser, e.g. Chrome or IE"
                 + "\nor (2)  view this page from <tt>localhost</tt> with a HTTP server."
                  ;
         }
         else {
            sMsg += '\n [info 20160622°0131] Failed reading file ' + sFilename + '.';
         }
      }

      return sRead;
   }

   /**
    * This function returns the path to the given script .. using regex
    *
    * @id 20110820°2041
    * @status working
    * @callers • CanvasGear func 20140815°1221 executeFrame
    * @param sScriptName {String} The name of the canary script, e.g. 'sitmapdaf.js'.
    * @returns {String} The wanted path, where the given script resides, but
    *    there are browser differences, e.g.
    *     - FF etc : scripts[i].src = 'http://localhost/manual/daftari/daftari.js'
    *     - IE     : scripts[i].src = '../daftari/daftari.js'
    */
   , retrieveScriptFolderAbs : function (sScriptName) // [Trekta.Utils.retrieveScriptFolderAbs]
   {
      var s = '';

      // () prepare regex [seq 20160621°0142]
      var regexMatch = / /;                                               // space between slashes prevents a syntax error
      var regexReplace = / /;
      s = sScriptName.replace(/\./g, "\\.") + "$";                        // e.g. 'dafutils.js' to 'dafutils\.js$'
      regexMatch = new RegExp(s, '');                                     // e.g. /dafutils\.js$/
      s = '(.*)' + s;                                                     // prepend group
      regexReplace = new RegExp(s, '');                                   // e.g. /(.*)dafutils\.js$/ ('/' seems automatically replaced by '\/')

      // () algo 20110820°2042 do the job (compare algo 20160503°0241)
      var path = '';
      var scripts = document.getElementsByTagName('SCRIPT');              // or 'script'
      if (scripts && scripts.length > 0) {
         for (var i in scripts) {
            // note : There are browser differences, e.g.
            //    • FF etc : scripts[i].src = 'http://localhost/manual/daftari/daftari.js'
            //    • IE     : scripts[i].src = '../daftari/daftari.js'
            if (scripts[i].src) {
               if (scripts[i].src.match(regexMatch)) {                    // e.g. /dafstart\.js$/
                  path = scripts[i].src.replace(regexReplace, '$1');      // e.g. /(.*)dafstart.js$/
               }
            }
         }
      }

      return path; // e.g. "http://localhost/daftaridev/trunk/daftari/js/daftaro/"
   }

   /**
    * This function tells the relative path from the page to the given given script
    *
    * This function is useful if the script uses resources, e.g. images,
    *  which are located relative to the script, as typically is the case
    *  within a project folder structure.
    *
    * @id 20160501°1611
    * @ref See howto 20190209°0131 'retrieve this script path'
    * @todo 20190316°0141 'call retrieveScriptFolderRel without canary'
    *     Implement the possibility to call the function
    *     without parameter. Then we have no canary to seach for in the script
    *     tags, but we use the last from the list. This is the last one loaded,
    *     and mostly means the calling script itself.
    * @callers • dafstart.js from scriptlevel
    * @param sCanary {String} Trailing part of the wanted script, e.g. '/js/daftaro/dafutils.js'
    * @returns {String} The path to the folder where the given script resides
                *           , e.g. "'/js/daftaro/dafutils.js'"
    */
   , retrieveScriptFolderRel : function (sCanary)
   {
      var s = '';

      // () get the script tags list
      var scripts = document.getElementsByTagName('script');

      // () find the canary script tag
      var script = null;
      var bFound = false;
      for (var i = 0; i < scripts.length; i++) {
         if (scripts[i].src.indexOf(sCanary) > 0) {
            script = scripts[i];
            bFound = true;
            break;
         }
      }

      // paranoia
      if (! bFound) {
         s = '[20160501°1631] Fatal error'
            + '\n' + 'The wanted script could not be found.'
             + '\n' + 'It looks like the search string is wrong.'
              + '\n\n' + 'search string = ' + sCanary
               ;
         alert(s);
         return '';
      }

      // (.1) get the DOM internal absolute path
      //  This is just for fun, not finally wanted.
      s = script.src;
      s = s.substring(0, (s.length - sCanary.length));         // used as canary is '/js/daftaro/dafutils.js'
      Trekta.Utils.s_DaftariBaseFolderAbs = s;                 // e.g. "file:///G:/work/downtown/daftaridev/trunk/daftari/"

      // (.2) get the script tag's literal path (algo 20111225°1251)
      var sPathLiteral = '';
      for (var i = 0; i < script.attributes.length; i++) {
         if (script.attributes[i].name === 'src') {
            sPathLiteral = script.attributes[i].value;
            break;
         }
      }

      // reduce from canary script path to folder only path [seq 20190316°0131]
      // E.g. for sCanary "/js/daftaro/dafutils.js" :
      //    • "./../../daftari/js/daftaro/dafutils.js" ⇒ "./../../daftari/"
      //    • "./daftari/js/daftaro/dafutils.js"       ⇒ "./daftari/"
      var sPathOnly = sPathLiteral.substring ( 0 , ( sPathLiteral.length - sCanary.length + 1 ) );

      return sPathOnly;
   }

   /**
    * This function daisychains the given function on the windows.onload events
    *
    * @id 20160614°0331
    * @note Remember ref 20190328°0953 'mdn → addEventListener'
    * @callers
    * @param funczion {function} The function to be appended to the window.onload event
    * @returns nothing
    */
   , windowOnloadDaisychain : function(funczion) // [Trekta.Utils.windowOnloadDaisychain]
   {
      // is the onload handler already used?
      if ( window.onload ) {
         // preserve existing function(s) and append our additional function
         var ld = window.onload;
         window.onload = function() {
            ld();
            funczion();
         };
      }
      else {
         // no other handlers are registered yet
         window.onload = function() {
            funczion();
         };
      }
   }

   /**
    * This ~constant provides a flag whether the browser is Chrome or not
    *
    *  Explanation. The plain expression "navigator.appName.match(/Chrome/)"
    *  results in either True or Null. But I prefere the result being either
    *  True or False. This is achieved by wrapping the expression in the
    *  ternary operator, manually replacing Null by false.
    *
    * @todo 20190209°0833 : For browser detection, Inconsequently for some we use
    *    navigator.userAgent, for some we use navigator.appName. Standardize this.
    * @id 20160622°0221
    * @type Boolean
    */
   , bIs_Browser_Chrome : ( navigator.userAgent.match(/Chrome/) ? true : false ) // [Trekta.Utils.bIs_Browser_Chrome]

   /**
    * This ~constant provides a flag whether the browser is Internet Exporer or not
    *
    * @id 20150209°0941
    * @todo 20190209°0837 : Refine algo. Formerly we used the plain
    *    comparison 'if ( navigator.appName === "Microsoft Internet Explorer" )'.
    *    For code, compare function getBrowserInfo() in jquery.fancytree.logger.js.
    *    For code, compare function getIEVersion() in canvasgearexcanvas.js.
    * @type Boolean
    */
   , bIs_Browser_Explorer : ( navigator.appName.match(/Explorer/) ? true : false ) // [Trekta.Utils.bIs_Browser_Explorer]

   /**
    * This ~constant provides a flag whether the browser is Firefox or not
    *
    * @id 20160624°0121
    * @type Boolean
    */
   , bIs_Browser_Firefox : ( navigator.userAgent.match(/Firefox/) ? true : false ) // [Trekta.Utils.bIs_Browser_Firefox]

   /**
    * This property provides a flag whether the browser is Opera or not.
    *  Just nice to know, Opera seems to need no more extras anymore (2019).
    *
    * @note 20190314°0411 : Opera 58 seem to need no more extra treatment.
    * @note 20190314°0413 : In Opera 58 I saw this userAgent string
    *     • "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
    *       (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36 OPR/58.0.3135.118"
    * @id 20190107°0821
    * @type Boolean
    */
   , bIs_Browser_Opera : ( navigator.userAgent.match(/(Opera)|(OPR)/) ? true : false ) // [Trekta.Utils.bIs_Browser_Opera]

   /**
    * This ~constant tells whether to pop up debug messages or not
    *
    * @id 20190311°1521
    * @type Boolean
    */
   , bShow_Debug_Dialogs : false // [Trekta.Utils.bShow_Debug_Dialogs]

};
//~~~~~~~~~~~~~~~~~~~~~~~~~ Schnappel ~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~✂~~~~~~~~✂~~~~~~~~✂~~~~~~~~✂~~~~~~~~✂~~~~~~~~✂~~~~~~

// start mechanism [seq 20190106°0245]
Trekta.Utils.windowOnloadDaisychain(Sldgr.Func.startup);

/* eof */
