package com.pxview;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import cl.json.RNSharePackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.opensettings.OpenSettingsPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.smixx.fabric.FabricPackage;
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
            new VectorIconsPackage(),
            new SplashScreenReactPackage(),
            new RNSpinkitPackage(),
            new RNSharePackage(),
            new PhotoViewPackage(),
            new OpenSettingsPackage(),
            new ReactMaterialKitPackage(),
            new ReactNativeLocalizationPackage(),
            new LinearGradientPackage(),
            new RNFetchBlobPackage(),
            new FabricPackage(),
            new RNDeviceInfo(),
            new CookieManagerPackage(),
            new BlurViewPackage()
      );
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
