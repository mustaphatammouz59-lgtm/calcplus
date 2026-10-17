const MO='<option>Jan</option><option>Feb</option><option>Mar</option><option>Apr</option><option>May</option><option>Jun</option><option>Jul</option><option>Aug</option><option>Sep</option><option selected>Oct</option><option>Nov</option><option>Dec</option>';
const MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
document.querySelectorAll('select.mo').forEach(s=>s.innerHTML=MO);
let addlBuilt=false;
function money(v){return '$'+v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function toggleCosts(){document.getElementById('costs').style.display=document.getElementById('inc').checked?'block':'none';calc();}
function toggleMore(){const d=moreOpts.style.display!=='none';moreOpts.style.display=d?'none':'block';moreLink.textContent=d?'+ More Options':'\u2013 Fewer Options';}
function toggleAddl(){if(!addlBuilt){let h='';for(let k=0;k<10;k++){h+='<div class="addlRow row2" style="margin:6px 0"><input class="aa" type="number" value="0" oninput="calc()"><span>in</span><select class="am" onchange="calc()">'+MO+'</select><input class="ay" type="number" value="2026" oninput="calc()"></div>';}addlOpts.innerHTML=h;addlBuilt=true;}
const d=addlOpts.style.display!=='none';addlOpts.style.display=d?'none':'block';addlLink.textContent=d?'+ Additional One-Time Payments':'\u2013 Hide Below Inputs';}
function clearAll(){
const D={hp:'400000',dp:'80000',ty:'30',rt:'6.5',sy:'2026',ptx:'4800',ins:'1500',pmi:'0',hoa:'0',oth:'0',pti:'0',ini:'0',hoi:'0',oti:'0',xm:'0',xy:'0',ot:'0'};
for(const k in D)document.getElementById(k).value=D[k];
document.querySelectorAll('.addlRow .aa').forEach(a=>a.value='0');
document.querySelectorAll('.addlRow .ay').forEach(a=>a.value='2026');
document.querySelectorAll('.addlRow .am').forEach(a=>a.selectedIndex=9);
document.querySelectorAll('select.mo').forEach(s=>s.selectedIndex=9);
sm.selectedIndex=9;
inc.checked=false;bw.checked=false;
costs.style.display='none';
moreOpts.style.display='none';moreLink.textContent='+ More Options';
addlOpts.style.display='none';addlLink.textContent='+ Additional One-Time Payments';
calc();
}
function calc(){
const P=+hp.value-+dp.value, yrs=+ty.value, n=yrs*12, i=+rt.value/100/12;
const pay=i?P*i/(1-Math.pow(1+i,-n)):P/n;
const use=inc.checked, smi=sm.selectedIndex, syv=+sy.value;
const tax0=use?+ptx.value/12:0, ins0=use?+ins.value/12:0, pmi0=use?+pmi.value:0, hoa0=use?+hoa.value:0, oth0=use?+oth.value:0;
const ti=+pti.value/100, ii=+ini.value/100, hi=+hoi.value/100, oi=+oti.value/100;
const xmV=+xm.value, xmS=(+xmY.value-syv)*12+(xmM.selectedIndex-smi);
const xyV=+xy.value, xyMi=xyM.selectedIndex, xyY=+xyY.value;
const otV=+ot.value, otMi=otM.selectedIndex, otY=+otY.value;
const addl=[];document.querySelectorAll('.addlRow').forEach(r=>{const a=+r.querySelector('.aa').value;if(a>0)addl.push([a,r.querySelector('.am').selectedIndex,+r.querySelector('.ay').value]);});
let bal=P,totInt=0,months=n,totTax=0,totIns=0,totPMI=0,totHoa=0,totOth=0,yInt=0,yPrin=0;
const rows=[];
for(let m=1;m<=n&&bal>0.01;m++){
const yy=syv+Math.floor((smi+m-1)/12), mi=(smi+m-1)%12, yx=Math.floor((m-1)/12);
const it=bal*i;let pr=pay-it,ex=0;
if(m-1>=xmS)ex+=xmV;
if(xyV>0&&mi===xyMi&&yy>=xyY)ex+=xyV;
if(otV>0&&mi===otMi&&yy===otY)ex+=otV;
addl.forEach(a=>{if(mi===a[1]&&yy===a[2])ex+=a[0];});
pr+=ex;if(pr>bal)pr=bal;
bal-=pr;totInt+=it;yInt+=it;yPrin+=pr;
totTax+=tax0*Math.pow(1+ti,yx);totIns+=ins0*Math.pow(1+ii,yx);totPMI+=pmi0;totHoa+=hoa0*Math.pow(1+hi,yx);totOth+=oth0*Math.pow(1+oi,yx);
months=m;
if(m%12===0||bal<=0.01){rows.push([Math.ceil(m/12),yInt,yPrin,Math.max(0,bal)]);yInt=0;yPrin=0;}
}
const othM=pmi0+hoa0+oth0, totM=pay+tax0+ins0+othM;
mpay.textContent=money(totM);
r1a.textContent=money(pay);r1b.textContent=money(P+totInt);
r2a.textContent=money(tax0);r2b.textContent=money(totTax);
r3a.textContent=money(ins0);r3b.textContent=money(totIns);
r4a.textContent=money(othM);r4b.textContent=money(totPMI+totHoa+totOth);
r5a.textContent=money(totM);r5b.textContent=money(P+totInt+totTax+totIns+totPMI+totHoa+totOth);
s1.textContent=money(+hp.value);s2.textContent=money(P);s3.textContent=money(+dp.value);
s4.textContent=money(P+totInt);s5.textContent=money(totInt);
const pm=(smi+months)%12, py=syv+Math.floor((smi+months)/12);
s6.textContent=MN[pm]+'. '+py;
if(totM>0){
const p1=pay/totM*100,p2=p1+tax0/totM*100,p3=p2+ins0/totM*100;
donut.style.background='conic-gradient(#33689c 0 '+p1+'%, #7ab034 '+p1+'% '+p2+'%, #20b2aa '+p2+'% '+p3+'%, #a02020 '+p3+'% 100%)';
legend.innerHTML='<div><span class="sw" style="background:#33689c"></span>Principal &amp; Interest '+p1.toFixed(0)+'%</div><div><span class="sw" style="background:#7ab034"></span>Property Taxes '+(p2-p1).toFixed(0)+'%</div><div><span class="sw" style="background:#20b2aa"></span>Home Insurance '+(p3-p2).toFixed(0)+'%</div><div><span class="sw" style="background:#a02020"></span>Other Costs '+(100-p3).toFixed(0)+'%</div>';
}else{donut.style.background='#ddd';legend.innerHTML='';}
let html='<tr><th>Year</th><th>Interest</th><th>Principal</th><th>Ending Balance</th></tr>';
rows.forEach(r=>{html+='<tr><td>'+r[0]+'</td><td>'+money(r[1])+'</td><td>'+money(r[2])+'</td><td>'+money(r[3])+'</td></tr>';});
sched.innerHTML=html;
const exSum=xmV*12+xyV+otV+addl.reduce((s,a)=>s+a[0],0);
if(exSum>0){const base=pay*n-P;extraNote.textContent='With these extra payments you pay off in '+months+' months and save '+money(Math.max(0,base-totInt))+' in interest.';}
else extraNote.textContent='';
if(bw.checked){
const i2=i/2,p2y=pay/2;let b=P,per=0,bi=0;
while(b>0.01&&per<n*4){const it2=b*i2;let pr2=p2y-it2;if(pr2>b)pr2=b;b-=pr2;bi+=it2;per++;}
const mos=per/2;
biweek.style.display='block';
biweek.textContent='Biweekly payment: '+money(p2y)+' | Payoff: '+Math.floor(mos/12)+' yrs '+Math.round(mos%12)+' mos | Total interest: '+money(bi)+' | Save vs monthly: '+money(Math.max(0,(pay*n-P)-bi));
}else biweek.style.display='none';
}
calc();
