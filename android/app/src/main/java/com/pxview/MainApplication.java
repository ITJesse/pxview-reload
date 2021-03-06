package com.pxview;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import cl.json.RNSharePackage;
import com.github.yamill.orientation.OrientationPackage;
import com.opensettings.OpenSettingsPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.smixx.fabric.FabricPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeExceptionHandlerPackage(),
            new ReactNativeRestartPackage(),
            new BackgroundTimerPackage(),
            new PhotoViewPackage(),
            new RNZipArchivePackage(),
            new VectorIconsPackage(),
            new SplashScreenReactPackage(),
            new RNSpinkitPackage(),
            new RNSharePackage(),
            new OrientationPackage(),
            new OpenSettingsPackage(),
            new ReactMaterialKitPackage(),
            new ReactNativeLocalizationPackage(),
            new LinearGradientPackage(),
            new RNFetchBlobPackage(),
            new FabricPackage(),
            new RNExitAppPackage(),
            new RNDeviceInfo(),
            new CookieManagerPackage(),
            new BlurViewPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
