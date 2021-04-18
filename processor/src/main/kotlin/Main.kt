import com.atul.JavaOpenCV.ImShow
import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonElement
import com.google.gson.JsonObject
import org.opencv.core.*
import org.opencv.imgcodecs.Imgcodecs
import org.opencv.imgproc.Imgproc
import java.net.ServerSocket
import java.nio.charset.Charset
import java.util.*
import org.opencv.core.Core

import org.opencv.core.Scalar


fun main(args:Array<String>){
    System.loadLibrary(Core.NATIVE_LIBRARY_NAME)

    // Init socket
    val port = if(args.size == 1){ args[0].toInt() } else 9503
    val server = ServerSocket(port)

    while(true){
        val socket = server.accept()
        val input = socket.getInputStream()
        val base64 = input.readAllBytes().toString(Charset.forName("utf-8"))

        val decodedRawImage = Base64.getDecoder().decode(base64)
        val imgMat = Imgcodecs.imdecode(MatOfByte(*decodedRawImage), Imgcodecs.CV_LOAD_IMAGE_COLOR)
        Imgproc.resize(imgMat, imgMat, Size(755.0, 560.0))

        // Processing Code
        socket.getOutputStream().write(Gson().toJson(Process(imgMat)). toByteArray(Charset.forName("utf-8")))
        imgMat.release()
    }
}