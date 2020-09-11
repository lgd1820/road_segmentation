﻿# load_segmentation

개요
--------------------------
운전자로부터 수집한 데이터를 도로 세그먼트 별로 실시간 관리

위치 색인
-------------------------
![image](https://user-images.githubusercontent.com/65576979/92914228-66fe3a00-f466-11ea-8cb1-a3f0009c1501.png)

빠른 위치 검색과 도로 별 상태 정보를 나타내기 위해 도로 세그먼트라는 도로마다 가지는 정보를 부여
지도를 공통된 크기만큼 N 등분하여 각 부분마다 지정된 고유번호를 Cell 번호라고 하며, 그 Cell 범위안에 있는 도로 세그먼트는 해당 Cell 번호를 참조
세그먼트 번호는 도로를 식별하기 위한 도로의 고유 번호

![image](https://user-images.githubusercontent.com/65576979/92914626-bfcdd280-f466-11ea-9514-0d6971dceeb8.png)

세그먼트는 그림에서 와 같이 실선으로 이루어진 MBR 이라는 최소 영역을 가지고 있으며 이 영역을 통해 현재 운전자가 어느 도로에 있는지 판단
여기서 파란색 동그라미는 어느 한 운전자의 궤적을 GPS로 나타낸것으로 운전자의 진행방향은 A -> B -> C
MBR 영역을 벗어날 경우 Cell의 세그먼트를 불러와 다시 위치 색인
