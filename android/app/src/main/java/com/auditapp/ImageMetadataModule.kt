package com.auditapp

import android.app.Activity
import android.content.Intent
import android.database.Cursor
import android.graphics.Bitmap
import android.net.Uri
import android.provider.MediaStore
import android.util.Log
import com.drew.imaging.ImageMetadataReader
import com.drew.metadata.Metadata
import com.drew.metadata.exif.GpsDirectory
import com.drew.metadata.exif.ExifIFD0Directory
import com.facebook.react.bridge.*
import org.json.JSONObject
import java.io.File
import java.io.InputStream
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import java.util.*
import android.graphics.BitmapFactory
import android.util.Base64
import java.io.ByteArrayOutputStream


class ImageMetadataModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var promise: Promise? = null
    private val PICK_IMAGE_REQUEST = 1

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "ImageMetadataModule"
    }

    @ReactMethod
    fun openGallery(promise: Promise) {
        this.promise = promise
        val activity = currentActivity
        if (activity == null) {
            promise.reject("ERROR", "Activity is null")
            return
        }
        val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
        activity.startActivityForResult(intent, PICK_IMAGE_REQUEST)
    }

        @ReactMethod
fun openGooglePhotos(promise: Promise) {
    this.promise = promise
    val activity = currentActivity
    if (activity == null) {
        promise.reject("ERROR", "Activity is null")
        return
    }

    val intent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
    intent.type = "image/*"
    intent.setPackage("com.google.android.apps.photos") // Force open Google Photos

    try {
        activity.startActivityForResult(intent, PICK_IMAGE_REQUEST)
    } catch (e: Exception) {
        promise.reject("ERROR", "Google Photos app not found")
    }
}

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == PICK_IMAGE_REQUEST && resultCode == Activity.RESULT_OK && data != null) {
            val imageUri = data.data
            if (imageUri != null) {
                extractMetadata(imageUri)
            } else {
                promise?.reject("ERROR", "Image selection failed")
            }
        }
    }

    override fun onNewIntent(intent: Intent?) {}

   private fun extractMetadata(imageUri: Uri) {
    try {
        val context = reactApplicationContext
        val filePath = getRealPathFromURI(imageUri)
        val fileName = filePath?.substringAfterLast(File.separator) ?: "Unknown"
        val fileType = context.contentResolver.getType(imageUri) ?: "Unknown" 

        val inputStream: InputStream? = context.contentResolver.openInputStream(imageUri)
        val metadata: Metadata = ImageMetadataReader.readMetadata(inputStream!!)
        inputStream.close()

        val gpsDirectory = metadata.getFirstDirectoryOfType(GpsDirectory::class.java)
        val exifDirectory = metadata.getFirstDirectoryOfType(ExifIFD0Directory::class.java)

        val lat = gpsDirectory?.geoLocation?.latitude ?: 0.0
        val lon = gpsDirectory?.geoLocation?.longitude ?: 0.0

        val timestamp = exifDirectory?.getDate(ExifIFD0Directory.TAG_DATETIME)
        val utcTimeStamp = formatToUTC(timestamp) 

        // ✅ Convert image to Base64
        val base64String = convertImageToBase64(imageUri)

        // ✅ Create JSON with Base64 & GPS location
        val result = JSONObject()
        result.put("uri", imageUri.toString())
        result.put("filePath", filePath ?: "Unknown")
        result.put("fileName", fileName)
        result.put("fileType", fileType) 
        result.put("latitude", lat)
        result.put("longitude", lon)
        result.put("timestamp", utcTimeStamp)
        result.put("base64", base64String) // ✅ Add Base64 data

        promise?.resolve(result.toString())

    } catch (e: Exception) {
        promise?.reject("ERROR", e.message)
    }
}



private fun convertImageToBase64(imageUri: Uri): String {
    val context = reactApplicationContext
    val inputStream: InputStream? = context.contentResolver.openInputStream(imageUri)
    val bitmap = BitmapFactory.decodeStream(inputStream)
    inputStream?.close()

    val outputStream = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream) // Compress as JPEG
    val byteArray = outputStream.toByteArray()
    return Base64.encodeToString(byteArray, Base64.DEFAULT) // Convert to Base64
}

    private fun getRealPathFromURI(uri: Uri): String? {
        val context = reactApplicationContext
        var result: String? = null
        val cursor: Cursor? = context.contentResolver.query(uri, arrayOf(MediaStore.Images.Media.DATA), null, null, null)
        cursor?.use {
            if (it.moveToFirst()) {
                val columnIndex = it.getColumnIndex(MediaStore.Images.Media.DATA)
                if (columnIndex != -1) {
                    result = it.getString(columnIndex)
                }
            }
        }
        return result
    }

   fun formatToUTC(date: Date?): String {
    if (date == null) return "0" // ✅ Return "0" if no date is available

    val utcFormat = SimpleDateFormat("YYYY-MM-DD hh:mm:ss", Locale.getDefault()) // ✅ Set desired format
    utcFormat.timeZone = TimeZone.getTimeZone("UTC") // ✅ Convert to UTC
    return utcFormat.format(date) // ✅ Return formatted date
}
}
