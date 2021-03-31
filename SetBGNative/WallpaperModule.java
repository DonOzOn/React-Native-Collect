

package com.bluezone;

import android.app.AlertDialog;
import android.app.WallpaperManager;
import android.content.ActivityNotFoundException;
import android.content.ContentValues;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.webkit.MimeTypeMap;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Calendar;

import static androidx.core.app.ActivityCompat.startActivityForResult;
import static androidx.core.content.ContextCompat.startActivity;

public class WallpaperModule extends ReactContextBaseJavaModule {
    ReactApplicationContext reactContext;

    public WallpaperModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "WallpaperModule";
    }

    @ReactMethod
    public void showText(String mess, boolean off) throws MalformedURLException, IOException {
        if(off == true){
            setAsWallpaper(mess);
        }else{
            File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES); //Creates app specific folder
            path.mkdirs();
            //name of image
            String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(Calendar.getInstance().getTime());
            Log.i("timeStamp", "-> timeStamp=" + timeStamp);
            File imageFile = new File(path, timeStamp + ".png"); // Imagename.png
            FileOutputStream out = new FileOutputStream(imageFile);
            try {
                getBitmapFromURL(mess).compress(Bitmap.CompressFormat.PNG, 100, out); // Compress Image
                out.flush();
                out.close();
                // Tell the media scanner about the new file so that it is
                // immediately available to the user.
                MediaScannerConnection.scanFile(reactContext, new String[]{imageFile.getAbsolutePath()}, null, new MediaScannerConnection.OnScanCompletedListener() {
                    public void onScanCompleted(String path, Uri uri) {
                        Log.i("ExternalStorage", "Scanned " + path + ":");
                        Log.i("ExternalStorage", "-> uri=" + uri);
                        setAsWallpaper(path);
                    }
                });

            } catch (Exception e) {
                Toast.makeText(reactContext, "Có lỗi xảy ra", Toast.LENGTH_SHORT).show();
                throw new IOException();
            }
        }

    }

    private String saveToInternalStorage() {
        ContextWrapper cw = new ContextWrapper(getReactApplicationContext());
        // path to /data/data/yourapp/app_data/imageDir
        File directory = cw.getDir("files", Context.MODE_PRIVATE);
        // Create imageDir
        FileOutputStream fos = null;
        try {
            File mypath = new File(directory, "1.jpg");
            Bitmap bitmapImage = BitmapFactory.decodeStream(new FileInputStream(mypath));
            fos = new FileOutputStream(mypath);
            System.out.println("fos: " + fos);
            // Use the compress method on the BitMap object to write image to the OutputStream
            bitmapImage.compress(Bitmap.CompressFormat.PNG, 100, fos);
        } catch (Exception e) {
            Toast.makeText(reactContext, "Có lỗi xảy ra", Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        } finally {
            try {
                fos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        System.out.println("directory.getAbsolutePath(): " + directory.getAbsolutePath());
        return directory.getAbsolutePath();
    }

    /**
     * convert image link to bitmap type
     *
     * @param src
     * @return
     */
    public Bitmap getBitmapFromURL(String src) {
        try {
            URL url = new URL(src);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();
            Bitmap myBitmap = BitmapFactory.decodeStream(input);
            return myBitmap;
        } catch (IOException e) {
            // Log exception
            Toast.makeText(reactContext, "Có lỗi xảy ra", Toast.LENGTH_SHORT).show();
            return null;
        }
    }


    /**
     * set wallpager
     *
     * @param path_of_file
     */
    private void setAsWallpaper(String path_of_file) {
        try {
            Intent intent = new Intent();
            intent.setAction(Intent.ACTION_ATTACH_DATA);
            File file = new File(path_of_file);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.setDataAndType(FileProvider.getUriForFile(reactContext,
                    BuildConfig.APPLICATION_ID + ".provider", file),
                    getMimeType(path_of_file));
            reactContext.startActivity(intent);
        } catch (ActivityNotFoundException e) {
            Toast.makeText(reactContext, "Có lỗi xảy ra", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * get type of file
     *
     * @param url
     * @return
     */
    private static String getMimeType(String url) {
        String type = null;
        String extension = MimeTypeMap.getFileExtensionFromUrl(url);
        if (extension != null) {
            type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        }
        return type;
    }

    @ReactMethod
    public void showTextDon(String mess) {
        System.out.println("Hello222" + mess);
    }
}
