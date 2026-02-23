package com.gemiusplugin

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.gemius.sdk.Config
import com.gemius.sdk.audience.AudienceConfig
import com.gemius.sdk.audience.AudienceEvent
import com.gemius.sdk.audience.BaseEvent
import com.gemius.sdk.stream.EventProgramData
import com.gemius.sdk.stream.Player
import com.gemius.sdk.stream.PlayerData
import com.gemius.sdk.stream.ProgramData

class LRTGemiusPluginModule(private val reactContext: ReactApplicationContext) :
  NativeLRTGemiusPluginSpec(reactContext) {

  private var player: Player? = null

  companion object {
    const val TAG = "LRTGemiusPlugin"
    const val NAME = NativeLRTGemiusPluginSpec.NAME
  }

  override fun setAppInfo(
    app: String,
    version: String,
    gemiusHitCollectorHost: String,
    gemiusPrismIdentifier: String,
  ) {
    Log.i(TAG, "Setting app info: app[$app] version[$version]")
    Config.setAppInfo(app, version)
    AudienceConfig.getSingleton().setHitCollectorHost(gemiusHitCollectorHost)
    AudienceConfig.getSingleton().setScriptIdentifier(gemiusPrismIdentifier)
  }

  override fun setPlayerInfo(playerId: String, serverHost: String, accountId: String) {
    Log.w(TAG, "Initialising player...")
    if (player == null) {
      player = Player(playerId, serverHost, accountId, PlayerData())
      player!!.setContext(reactContext)
    } else {
      Log.w(TAG, "Player already initialised")
    }
  }

  override fun setProgramData(clipId: String, name: String, duration: Double, type: String) {
    val durationInt = duration.toInt()
    Log.d(TAG, "Setting new program data for '$name'")
    val programData = ProgramData()
    programData.setName(name)
    programData.setDuration(durationInt)
    if (type == "audio") {
      programData.setProgramType(ProgramData.ProgramType.AUDIO)
    } else {
      programData.setProgramType(ProgramData.ProgramType.VIDEO)
    }
    player?.newProgram(clipId, programData)
  }

  override fun sendPlay(clipId: String, offset: Double) {
    val offsetInt = offset.toInt()
    Log.d(TAG, "Player PLAY event for '$clipId' offset: $offsetInt")
    val eventProgramData = EventProgramData()
    eventProgramData.setAutoPlay(true)
    player?.programEvent(clipId, offsetInt, Player.EventType.PLAY, eventProgramData)
  }

  override fun sendPause(clipId: String, offset: Double) {
    val offsetInt = offset.toInt()
    Log.d(TAG, "Player PAUSE event for '$clipId' offset: $offsetInt")
    player?.programEvent(clipId, offsetInt, Player.EventType.PAUSE, EventProgramData())
  }

  override fun sendStop(clipId: String, offset: Double) {
    val offsetInt = offset.toInt()
    Log.d(TAG, "Player STOP event for '$clipId' offset: $offsetInt")
    player?.programEvent(clipId, offsetInt, Player.EventType.STOP, EventProgramData())
  }

  override fun sendBuffer(clipId: String, offset: Double) {
    val offsetInt = offset.toInt()
    Log.d(TAG, "Player BUFFER event for '$clipId' offset: $offsetInt")
    player?.programEvent(clipId, offsetInt, Player.EventType.BUFFER, EventProgramData())
  }

  override fun sendClose(clipId: String, offset: Double) {
    val offsetInt = offset.toInt()
    Log.d(TAG, "Player CLOSE event for '$clipId' offset: $offsetInt")
    player?.programEvent(clipId, offsetInt, Player.EventType.CLOSE, EventProgramData())
  }

  override fun sendSeek(clipId: String, offset: Double) {
    val offsetInt = offset.toInt()
    Log.d(TAG, "Player SEEK event for '$clipId' offset: $offsetInt")
    player?.programEvent(clipId, offsetInt, Player.EventType.SEEK, EventProgramData())
  }

  override fun sendComplete(clipId: String, offset: Double) {
    val offsetInt = offset.toInt()
    Log.d(TAG, "Player COMPLETE event for '$clipId' offset: $offsetInt")
    player?.programEvent(clipId, offsetInt, Player.EventType.COMPLETE, EventProgramData())
  }

  override fun sendPageViewedEvent(gemiusPrismIdentifier: String, extraParameters: ReadableMap?) {
    Log.d(TAG, "sendPageViewedEvent() called.")
    Handler(Looper.getMainLooper()).post {
      val event = AudienceEvent(reactContext)
      event.setScriptIdentifier(gemiusPrismIdentifier)
      event.setEventType(BaseEvent.EventType.FULL_PAGEVIEW)
      addParamsToEvent(event, extraParameters)
      event.sendEvent()
    }
  }

  override fun sendPartialPageViewedEvent(
    gemiusPrismIdentifier: String,
    extraParameters: ReadableMap?,
  ) {
    Log.d(TAG, "sendPartialPageViewedEvent() called.")
    Handler(Looper.getMainLooper()).post {
      val event = AudienceEvent(reactContext)
      event.setScriptIdentifier(gemiusPrismIdentifier)
      event.setEventType(BaseEvent.EventType.PARTIAL_PAGEVIEW)
      addParamsToEvent(event, extraParameters)
      event.sendEvent()
    }
  }

  override fun sendActionEvent(gemiusPrismIdentifier: String, extraParameters: ReadableMap?) {
    Log.d(TAG, "sendActionEvent() called.")
    Handler(Looper.getMainLooper()).post {
      val event = AudienceEvent(reactContext)
      event.setScriptIdentifier(gemiusPrismIdentifier)
      event.setEventType(BaseEvent.EventType.ACTION)
      addParamsToEvent(event, extraParameters)
      event.sendEvent()
    }
  }

  private fun addParamsToEvent(event: BaseEvent, paramsMap: ReadableMap?) {
    paramsMap?.let {
      val iterator = it.keySetIterator()
      while (iterator.hasNextKey()) {
        val key = iterator.nextKey()
        val value = when (it.getType(key)) {
          ReadableType.Number -> {
            val d = it.getDouble(key)
            if (d == Math.floor(d)) d.toLong().toString() else d.toString()
          }
          ReadableType.Boolean -> it.getBoolean(key).toString()
          else -> it.getString(key) ?: ""
        }
        event.addExtraParameter(key, value)
      }
    }
  }
}
