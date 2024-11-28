struct Grid {
    vec3 id;
    float d;
} gr;
#define FBI floatBitsToInt
 #define FFBI(a) FBI(cos(a))^FBI(a)
 float hash(vec3 uv){
       int x = FFBI(uv.x);
       int y = FFBI(uv.y);
       int z = FFBI(uv.z);
       return float((x*x+y)*(y*y-x)*(z*z+x))/2.14e9;
   }
void dogrid(vec3 ro,vec3 rd,float size){
    gr.id = (floor(ro+rd*1E-3)/size+.5)*size;
    vec3 src = -(ro-gr.id)/rd;
    vec3 dst = abs(.5*size)/rd;
    vec3 bz = src+dst;
    gr.d = min(bz.x,min(bz.y,bz.z));
}
vec3 erot(vec3 p,vec3 ax,float t){return mix(dot(ax,p)*ax,p,cos(t))+cross(ax,p)*sin(t);}
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord.xy -.5* iResolution.xy)/iResolution.y;
    vec3 col = vec3(0.);
    vec3 ro=vec3(0.2,0.2,-5.),rt=vec3(0.);
    vec3 z = normalize(rt-ro),x=normalize(cross(z,vec3(0.,-1.,0.))),y=cross(z,x);
    vec3 rd = mat3(x,y,z)*normalize(vec3(uv,2.+tanh(hash(uv.xyy+iTime)*.5+10.*sin(iTime))));
    float i,e,g;
    float gridlen = 0.;
    for(i=0.,e=.01,g=0.;i++<99.;){
        vec3 p = ro+rd*g;
        vec3 oop=p;
        p = erot(p,normalize(sin(iTime*.33+vec3(-.6,.4,.2))),iTime*.2);
        p.z+=iTime;
 
        vec3 op=p;       
        if(gridlen <=g){
        dogrid(p,rd,1.);
        gridlen+=gr.d;
        }
        p-=gr.id;
        float gy = dot(sin(gr.id*2.),cos(gr.id.zxy*5.));
        float rn = hash(gr.id);
        p.x +=sin(rn)*.25;
        
        float h =  rn> .0 ? .5:length(p)-.01-gy*.05+rn*.02;
        
        g+=e= max(.001+op.z*.000002, abs(h));
        col+=vec3(.25,.25,1.+abs(rn))*(0.025+(.02*exp(5.*fract(gy+iTime))))/exp(e*e*i);
          
    }
     col*=exp(-.08*g);
    fragColor = vec4(sqrt(col),1.0);
}