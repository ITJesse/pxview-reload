package com.utopia.pxview;

import android.app.Application;

import com.squareup.leakcanary.LeakCanary;
import com.facebook.react.ReactApplication;
import com.rnziparchive.RNZipArchivePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.cmcewen.blurview.BlurViewPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.opensettings.OpenSettingsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import cl.json.RNSharePackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.smixx.fabric.FabricPackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.utopia.pxview.UgoiraView.UgoiraViewPackage;

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
          new RNSpinkitPackage(),
           new MainReactPackage(),
            new UgoiraViewPackage(),
            new RNZipArchivePackage(),
            new LinearGradientPackage(),
            new BlurViewPackage(),
            new SplashScreenReactPackage(),
            new OpenSettingsPackage(),
            new RNDeviceInfo(),
            new CookieManagerPackage(),
            new ReactNativeLocalizationPackage(),
            new RNSharePackage(),
            new ReactMaterialKitPackage(),
            new VectorIconsPackage(),
            new FabricPackage(),
            new PhotoViewPackage(),
            new RNSpinkitPackage(),
            new RNFetchBlobPackage()
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
    Fabric.with(this, new Crashlytics());
    if (LeakCanary.isInAnalyzerProcess(this)) {
      // This process is dedicated to LeakCanary for heap analysis.
      // You should not init your app in this process.
      return;
    }
    LeakCanary.install(this);
  }
}
