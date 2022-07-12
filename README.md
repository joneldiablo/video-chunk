# Video chunks

Split a video in equal parts

install:

```shell
sudo apt install ffmpeg
npm install -g video-chunk
```

use:

```shell
video-chunk pathFile [parts; default=4 [pathOutput; default=pathFile]]
```

examples:

```shell
video-chunk /path/to/video.mp4
video-chunk /path/to/video.mp4 4 /path/to/output
```
