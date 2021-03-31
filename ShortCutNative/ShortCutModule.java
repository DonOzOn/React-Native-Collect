package com.bluezone;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.content.pm.ShortcutInfoCompat;
import androidx.core.content.pm.ShortcutManagerCompat;
import androidx.core.graphics.drawable.IconCompat;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Collections;
import java.util.List;

public class ShortCutModule extends ReactContextBaseJavaModule {
    ShortCutModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "ShortCutModule";
    }

    @ReactMethod
    public void createShortCut(String name,String message) {
        // Checking if ShortCut was already added
        SharedPreferences sharedPreferences = getReactApplicationContext().getSharedPreferences(name, getReactApplicationContext().MODE_PRIVATE);
//        boolean shortCutWasAlreadyAdded = sharedPreferences.getBoolean(name, false);
//        if (shortCutWasAlreadyAdded) return;
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            final Intent shortcutIntent = new Intent(getReactApplicationContext(), MainActivity.class);
            shortcutIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
            shortcutIntent.putExtra("shortcutKey", name);
            shortcutIntent.setAction(Intent.ACTION_MAIN);
            final Intent intent = new Intent();
            intent.putExtra(Intent.EXTRA_SHORTCUT_INTENT, shortcutIntent);
            intent.putExtra(Intent.EXTRA_SHORTCUT_NAME, name);
            intent.putExtra(ShortcutManagerCompat.EXTRA_SHORTCUT_ID, 1);
            intent.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE, Intent.ShortcutIconResource.fromContext(getReactApplicationContext(), R.mipmap.icon_bluezone));
            intent.putExtra("duplicate", false);
            intent.setAction("com.android.launcher.action.INSTALL_SHORTCUT");
            getReactApplicationContext().sendBroadcast(intent);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N_MR1) {
                addShortCutBigAndroid(shortcutIntent, name);
            }
        } else {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N_MR1) {
                ShortcutInfoCompat webShortcut = addShortCutBigAndroid(new Intent(Intent.ACTION_MAIN, Uri.EMPTY, getReactApplicationContext(), MainActivity.class)
                        .setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK)
                        .putExtra("shortcutKey", name), name);

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && ShortcutManagerCompat.isRequestPinShortcutSupported(getReactApplicationContext())) {
                    ShortcutManagerCompat.requestPinShortcut(getReactApplicationContext(), webShortcut, null);
                }
            }
        }
        Toast toast=Toast. makeText(getReactApplicationContext(),message,Toast. LENGTH_SHORT);
        toast. show();
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putBoolean(name, true);
        editor.commit();
    }

    public ShortcutInfoCompat addShortCutBigAndroid(Intent shortcutIntent, String name) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N_MR1) {
            ShortcutInfoCompat webShortcut = null;
            webShortcut = new ShortcutInfoCompat.Builder(getReactApplicationContext(), "shortcut_bluzone")
                    .setShortLabel(name)
                    .setLongLabel(name)
                    .setIcon(IconCompat.createWithResource(getReactApplicationContext(), R.mipmap.icon_bluezone))
                    .setIntent(shortcutIntent)
                    .build();
            ShortcutManagerCompat.addDynamicShortcuts(getReactApplicationContext(), Collections.singletonList(webShortcut));

            return webShortcut;
        }
        return null;
    }

    @ReactMethod
    public void getCurrentShortcut(Callback callback) {
        String shortcutUrl = getReactApplicationContext().getCurrentActivity().getIntent().getStringExtra("shortcutKey");
        callback.invoke(shortcutUrl);
    }

    @ReactMethod
    public void getShortcutExist(Callback callback) {
        List<ShortcutInfoCompat> shortcutInfoCompats =  ShortcutManagerCompat.getDynamicShortcuts(getReactApplicationContext());
        System.out.println("shortcutInfoCompats = " + shortcutInfoCompats);
        callback.invoke(shortcutInfoCompats.toString());
    }
}
