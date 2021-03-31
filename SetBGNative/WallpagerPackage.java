package com.bluezone;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class WallpagerPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules( ReactApplicationContext reactApplicationContext) {
        List<NativeModule> nativeModules =  new ArrayList<>();
        nativeModules.add(new WallpaperModule(reactApplicationContext));
        return nativeModules;
    }

    @Override
    public List<ViewManager> createViewManagers( ReactApplicationContext reactApplicationContext) {
        return Collections.emptyList();
    }

}
