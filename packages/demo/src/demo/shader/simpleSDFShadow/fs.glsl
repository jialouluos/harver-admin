precision mediump float;
#define TIME_SCALE 0.5

#define fragCoord gl_FragCoord
#define fragColor gl_FragColor
#define PI 3.1415926
varying vec2 v_uv;

uniform float u_Time;
uniform vec2 u_Mouse;
uniform vec2 u_Size;
const int MAX_STEPS = 100;
const float MAX_DIST = 100.;
const float SURF_DIST = 0.01;
const float samples = 4.;
const float offset = 0.1;

float RayMarch(vec3 ro, vec3 rd);

/// @note 材质结构体
struct Material {
    float specular;
    float diffuse;
    vec3 normal;
};

// 三种 SDF
float Sphere(vec3 p, vec3 pos, float radius) {
    return (length(p - pos) - radius);
}

float Capsule(vec3 p, vec3 pos, float len, float radius) {
    vec3 pA = pos + vec3(0.0, 1.0, 0.0) * len / 2.0;
    vec3 pB = pos - vec3(0.0, 1.0, 0.0) * len / 2.0;
    vec3 ap = p - pA;
    vec3 ab = pB - pA;
    float t = dot(ap, ab) / dot(ab, ab);
    t = clamp(t, 0.0, 1.0);

    vec3 c = pA + t * (pB - pA);
    float d = length(p - c) - radius;

    return d;
}

float Cube(vec3 p, vec3 pos, vec3 s) {
    return length(max(abs(p - pos) - s, 0.0));
}

/* ----------------------------------------------------- */
/// @note 距离场：场景中的各个物体
float GetDist(vec3 p) {
    /// @note 分别的 SDF 函数
    float sphereDist = Sphere(p, vec3(0.0, 1.0 * sin(u_Time) * TIME_SCALE, 0.0), 0.8);
    float planeDist = p.y;
    float capsDepth = Capsule(p, vec3(2.0, 1.0 * cos(u_Time) * TIME_SCALE, 0.0), 1.0, 0.5);
    float cubeDepth = Cube(p, vec3(-2, 1.0 * sin(u_Time * TIME_SCALE), 0.0), vec3(0.8));

    /// @note SDF 的合成
    float d = min(sphereDist, planeDist);
    d = min(d, capsDepth);
    d = min(d, cubeDepth);

    return d;
}

/// @note 法线
vec3 GetNormal(vec3 p) {
    float offset = 1e-4;

    /// @note 分别在三维上稍稍偏移
    vec3 n = vec3(GetDist(p) - GetDist(p - vec3(offset, 0, 0)), GetDist(p) - GetDist(p - vec3(0, offset, 0)), GetDist(p) - GetDist(p - vec3(0, 0, offset)));
    return normalize(n);
}

/// @note 计算光照和阴影
Material mat;
float GetLight(vec3 p, vec3 viewDir) {
    /// @note 随着时间变化位置的光源
    vec3 lightPos = vec3(8.0, 8.0, 8.0);
    lightPos.xz += vec2(sin(u_Time * TIME_SCALE), cos(u_Time * TIME_SCALE)) * 6.0;

    /// @note 场景物体坐标到光源的方向
    vec3 lightDir = normalize(lightPos - p);

    /// @note 物体的法线
    mat.normal = GetNormal(p);
    /// @note diffuse
    mat.diffuse = max(0.0, dot(lightDir, mat.normal));

    /// @note specular==>镜面反射
    vec3 halfVec = normalize(normalize(viewDir) + normalize(lightDir));
    float spec = dot(halfVec, mat.normal);

    //spec = clamp(spec, 0.0, 1.0);
    mat.specular = 1.0;
    mat.specular = max(0.0, pow(spec * mat.specular, 150.0));

    /// @note 沿法线方向扩张一丢丢，然后沿着之前计算的光的方向 raymarch 回光源
    float d = RayMarch(p + mat.normal * SURF_DIST * 2.0, lightDir);
    // @note shadow，如果中间有阻挡，则 raymarch 的距离会小于其到光源的距离
    if(d < length(lightPos - p)) {
        mat.diffuse *= 0.1;
        mat.specular *= 0.0;
    }

    return mat.diffuse + mat.specular;
}

/// @note 光线步进主流程
float RayMarch(vec3 ro, vec3 rd) {
    float dN = 0.0;
    for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dN;
        float d = GetDist(p);
        dN += d;
        if(dN > MAX_DIST || d < SURF_DIST)
            break;
    }

    return dN;
}

/// @note 旋转矩阵
mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}
/// @note uv 3D 坐标到相机的方向
vec3 R(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l - p),                   ///< forwwad
    r = normalize(cross(vec3(0, 1, 0), f)), ///< right
    u = cross(f, r),                        ///< up
    c = p + f * z, i = c + uv.x * r + uv.y * u,            ///< View->World
    d = normalize(i - p);
    return d;
}

float RenderScene() {
    vec2 uv = (v_uv - .5) * 2.;

    vec3 rOri = vec3(0, 4, 4);
    rOri.yz *= Rot(0. * 6.2831);
    rOri.xz *= Rot(0. * 6.2831);
    vec3 rDir = R(uv, rOri, vec3(0, -1, 0), .7);

    float d = RayMarch(rOri, rDir); ///< 场景中的距离场
    vec3 p = rOri + rDir * d;       ///< 场景中各物体的 3D 坐标

    float dif = GetLight(p, -rDir);
    return dif;
}

void main() {

    float dif = RenderScene();

    fragColor = vec4(vec3(dif), 1.0);
}